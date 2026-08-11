// Parametric playground engine: one emboss panel filling the canvas, every lever a
// live uniform. The playground calls setParams()/setContent() and it re-renders.
// The height field is rebuilt (async) only when the CONTENT or bevel SIZE changes;
// all other params are cheap per-frame uniforms.

import { PG_VERT, PG_FRAG } from "./pg-shader";
import { makeContentField, type Content } from "./content-mask";
import type { EmbossParams } from "./params";

// Texturas generadas para Vibeset (el original las servia desde su CDN).
const PLASTER_URL = "/demo/emboss-plaster.webp";
const GRUNGE_URL = "/demo/emboss-grunge.webp";
const GRUNGE_AMT = 0.38;

export class EmbossPlayground {
  private host: HTMLElement;
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null = null;
  private prog: WebGLProgram | null = null;
  private loc: Record<string, WebGLUniformLocation | null> = {};
  private field: WebGLTexture | null = null;
  private plaster: WebGLTexture | null = null;
  private grunge: WebGLTexture | null = null;
  private fieldW = 1;
  private fieldH = 1;

  private w = 0;
  private h = 0;
  private dpr = 1;
  private fontFamily = "var(--font-neue-corp), sans-serif";

  private params: EmbossParams;
  private content: Content;
  private lastSize = -1;
  private fieldSeq = 0; // guards against out-of-order async field builds

  private raf = 0;
  private running = false;
  private fieldReady = false; // the height field has been built at least once
  private painted = false; // canvas revealed after its first real frame
  ok = false;

  constructor(host: HTMLElement, params: EmbossParams, content: Content) {
    this.host = host;
    this.params = params;
    this.content = content;
    this.canvas = document.createElement("canvas");
    Object.assign(this.canvas.style, {
      position: "absolute", inset: "0", width: "100%", height: "100%", display: "block",
      // Hidden until the first real frame, so the white host shows instead of a black
      // undrawn canvas (matches the emboss card; avoids a black flash on mount).
      opacity: "0",
    });
    host.appendChild(this.canvas);

    const gl = this.canvas.getContext("webgl", { alpha: false, antialias: false, premultipliedAlpha: false });
    if (!gl) return;
    this.gl = gl;
    gl.clearColor(1, 1, 1, 1); // white, not the default black
    try { this.prog = this.build(PG_VERT, PG_FRAG); } catch { this.gl = null; return; }

    for (const u of [
      "uField", "uPlaster", "uGrunge", "uGrungeAmt", "uTexel", "uLight", "uLightZ",
      "uDepth", "uHi", "uSh", "uContrast", "uBright", "uTint", "uTexOff", "uTexScale",
      "uReveal", "uAspect",
    ]) this.loc[u] = gl.getUniformLocation(this.prog!, u);

    const aPos = gl.getAttribLocation(this.prog!, "aPosition");
    const aUV = gl.getAttribLocation(this.prog!, "aUV");
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1,0,1, 1,-1,1,1, -1,1,0,0, 1,1,1,0,
    ]), gl.STATIC_DRAW);
    gl.useProgram(this.prog);
    gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos,2,gl.FLOAT,false,16,0);
    gl.enableVertexAttribArray(aUV); gl.vertexAttribPointer(aUV,2,gl.FLOAT,false,16,8);

    this.field = gl.createTexture();
    this.plaster = this.placeholder([128,128,128,255]);
    this.grunge = this.placeholder([128,128,128,255]);
    this.loadTex(PLASTER_URL, () => this.plaster, false); // CLAMP (sub-window, no wrap)
    this.loadTex(GRUNGE_URL, () => this.grunge, false);

    this.resize();
    void this.rebuildField();
    this.ok = true;
  }

  private build(vs: string, fs: string): WebGLProgram {
    const gl = this.gl!;
    const c = (t: number, s: string) => {
      const sh = gl.createShader(t)!; gl.shaderSource(sh, s); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) || "compile");
      return sh;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, c(gl.VERTEX_SHADER, vs)); gl.attachShader(p, c(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || "link");
    return p;
  }

  private placeholder(rgba: number[]): WebGLTexture | null {
    const gl = this.gl; if (!gl) return null;
    const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array(rgba));
    return t;
  }

  private loadTex(url: string, target: () => WebGLTexture | null, repeat: boolean) {
    const img = new Image(); img.crossOrigin = "anonymous";
    img.onload = () => {
      const g = this.gl, tex = target(); if (!g || !tex) return;
      g.bindTexture(g.TEXTURE_2D, tex);
      g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, true);
      g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,img);
      const w = repeat ? g.REPEAT : g.CLAMP_TO_EDGE;
      g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,w);
      g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,w);
      g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.LINEAR);
      g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.LINEAR);
      g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, false);
      this.renderOnce();
    };
    img.src = url;
  }

  setFont(f: string) { this.fontFamily = f; void this.rebuildField(); }

  setParams(p: EmbossParams) {
    const sizeChanged = p.size !== this.params.size || p.soften !== this.params.soften;
    this.params = p;
    if (sizeChanged) void this.rebuildField();
    else this.renderOnce();
  }

  setContent(c: Content) { this.content = c; void this.rebuildField(); }

  private async rebuildField() {
    const gl = this.gl; if (!gl) return;
    // Cap the mask width (was DPR x2 supersample -> ~5000px on retina, a
    // multi-hundred-ms CPU build). ~1500px is plenty: crispness is from the pre-blur.
    const MAX_W = 1500;
    const mw = Math.max(2, Math.min(MAX_W, Math.round(this.w * this.dpr)));
    const mh = Math.max(2, Math.round(mw * (this.h / Math.max(1, this.w))));
    // bevel width (px @ card) -> field-space blur, plus the soften amount
    const blur = Math.max(1, (this.params.size + this.params.soften) * this.dpr * 1.2);
    this.lastSize = this.params.size;
    const seq = ++this.fieldSeq;
    const art = await makeContentField(this.content, blur, mw, mh, this.fontFamily);
    if (seq !== this.fieldSeq || !this.gl) return; // superseded
    gl.bindTexture(gl.TEXTURE_2D, this.field);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, art);
    this.fieldW = art.width; this.fieldH = art.height;
    this.fieldReady = true;
    this.renderOnce();
  }

  resize() {
    const r = this.host.getBoundingClientRect();
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = r.width; this.h = r.height;
    const cw = Math.max(1, Math.round(this.w * this.dpr));
    const ch = Math.max(1, Math.round(this.h * this.dpr));
    if (this.canvas.width !== cw || this.canvas.height !== ch) {
      this.canvas.width = cw; this.canvas.height = ch;
      this.gl?.viewport(0, 0, cw, ch);
      void this.rebuildField();
    }
  }

  private renderOnce() {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => { this.raf = 0; this.render(); });
  }

  private render() {
    const gl = this.gl, p = this.params; if (!gl || !this.prog) return;
    // Don't draw until the field is built (else a fieldless frame flashes / a black
    // canvas shows before the press). The white host shows through until then.
    if (!this.fieldReady) return;
    // light from the params' angle/altitude (no cursor interaction)
    const a = (p.angle * Math.PI) / 180;
    const lx = Math.cos(a);
    const ly = Math.sin(a);
    const lz = Math.max(0.25, Math.sin((p.altitude * Math.PI) / 180) + 0.3);
    gl.useProgram(this.prog);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.field); gl.uniform1i(this.loc.uField, 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.plaster); gl.uniform1i(this.loc.uPlaster, 1);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, this.grunge); gl.uniform1i(this.loc.uGrunge, 2);
    gl.uniform1f(this.loc.uGrungeAmt, GRUNGE_AMT);
    gl.uniform2f(this.loc.uTexel, 1 / this.fieldW, 1 / this.fieldH);
    gl.uniform2f(this.loc.uLight, lx, ly);
    gl.uniform1f(this.loc.uLightZ, lz);
    gl.uniform1f(this.loc.uDepth, p.depth);
    gl.uniform1f(this.loc.uHi, p.highlight);
    gl.uniform1f(this.loc.uSh, p.shadow);
    gl.uniform1f(this.loc.uContrast, p.contrast);
    gl.uniform1f(this.loc.uBright, p.bright);
    gl.uniform3f(this.loc.uTint, p.tint[0], p.tint[1], p.tint[2]);
    gl.uniform2f(this.loc.uTexOff, p.texOffset[0], p.texOffset[1]);
    gl.uniform1f(this.loc.uTexScale, p.texScale);
    gl.uniform1f(this.loc.uReveal, 1);
    gl.uniform1f(this.loc.uAspect, this.w / Math.max(1, this.h));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!this.painted) { this.painted = true; this.canvas.style.opacity = "1"; }
  }

  destroy() {
    if (this.raf) cancelAnimationFrame(this.raf);
    const gl = this.gl;
    if (gl) {
      [this.field, this.plaster, this.grunge].forEach((t) => t && gl.deleteTexture(t));
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
    this.canvas.remove();
  }
}
