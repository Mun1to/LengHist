// Rasterizes the pressed CONTENT (a word and/or an SVG shape, composed together) into
// a height field for the emboss shader. Blurs once on the CPU at the bevel radius.
// Packed: R = crisp coverage, G = blurred height. Async because an SVG is drawn via an
// <img> that must load.

export type Content = {
  word: string; // pressed word (empty in image mode)
  svg: string | null; // raw SVG markup (null in text mode)
};

export async function makeContentField(
  content: Content,
  blurPx: number,
  w: number,
  h: number,
  fontFamily: string,
): Promise<HTMLCanvasElement> {
  const W = Math.max(1, Math.round(w));
  const H = Math.max(1, Math.round(h));

  const crisp = document.createElement("canvas");
  crisp.width = W;
  crisp.height = H;
  const cx = crisp.getContext("2d")!;
  cx.clearRect(0, 0, W, H);

  // One mode at a time: a centered word, or a centered SVG.
  if (content.svg && content.svg.trim()) {
    await drawSvg(cx, content.svg, W, H, 0.5, 0.5, 0.52);
  } else if (content.word.trim()) {
    drawWord(cx, content, W, H, fontFamily, 0.5, 0.36);
  }

  const soft = document.createElement("canvas");
  soft.width = W;
  soft.height = H;
  const sx = soft.getContext("2d")!;
  sx.filter = `blur(${Math.max(0.5, blurPx).toFixed(2)}px)`;
  sx.drawImage(crisp, 0, 0);
  sx.filter = "none";

  const out = document.createElement("canvas");
  out.width = W;
  out.height = H;
  const ox = out.getContext("2d")!;
  const c = cx.getImageData(0, 0, W, H).data;
  const s = sx.getImageData(0, 0, W, H).data;
  const packed = ox.createImageData(W, H);
  const p = packed.data;
  for (let i = 0; i < p.length; i += 4) {
    p[i] = c[i + 3];
    p[i + 1] = s[i + 3];
    p[i + 2] = 0;
    p[i + 3] = 255;
  }
  ox.putImageData(packed, 0, 0);
  return out;
}

function drawWord(
  ctx: CanvasRenderingContext2D,
  content: Content,
  W: number,
  H: number,
  fontFamily: string,
  cyFrac: number,
  capFrac: number,
) {
  const text = content.word;
  if (!text) return;
  const cx = W / 2;
  const cy = H * cyFrac;
  const maxW = W * 0.82;

  let size = H * capFrac;
  ctx.font = `800 ${size}px ${fontFamily}`;
  const wWidth = ctx.measureText(text).width;
  if (wWidth > maxW) {
    size *= maxW / wWidth;
    ctx.font = `800 ${size}px ${fontFamily}`;
  }
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, cx, cy);
}

// Draw an SVG (as a white silhouette) centered at (cxFrac,cyFrac), sized to a
// fraction of the card. We force the fill to white via a wrapper so any SVG becomes
// a clean coverage mask regardless of its own colors.
async function drawSvg(
  ctx: CanvasRenderingContext2D,
  svg: string,
  W: number,
  H: number,
  cxFrac: number,
  cyFrac: number,
  sizeFrac: number,
): Promise<void> {
  // Force every fill/stroke white so ANY svg (incl. colored uploads) becomes a clean
  // white-on-transparent coverage mask (the shader reads alpha, so color is moot).
  const forced = svg.replace(
    /<svg([^>]*)>/i,
    `<svg$1><style>*{fill:#fff!important;stroke:#fff!important}</style>`,
  );
  const blob = new Blob([forced], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    const target = H * sizeFrac;
    const ar = img.width / Math.max(1, img.height);
    let dh = target;
    let dw = target * ar;
    const maxW = W * 0.82;
    if (dw > maxW) {
      dw = maxW;
      dh = dw / ar;
    }
    ctx.drawImage(img, W * cxFrac - dw / 2, H * cyFrac - dh / 2, dw, dh);
  } catch {
    // invalid SVG -> draw nothing (playground stays usable)
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

// Built-in marks users can drop in. Bold, solid, medium-complexity shapes read best
// as a press (fine detail gets lost in the bevel). All draw as a white silhouette.
export const BUILTIN_SVGS: { id: string; name: string; svg: string }[] = [
  {
    id: "sparkle",
    name: "Sparkle",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 4 C54 34 66 46 96 50 C66 54 54 66 50 96 C46 66 34 54 4 50 C34 46 46 34 50 4 Z"/></svg>`,
  },
  {
    id: "star",
    name: "Star",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 4 L61 38 L97 38 L68 60 L79 94 L50 72 L21 94 L32 60 L3 38 L39 38 Z"/></svg>`,
  },
  {
    id: "heart",
    name: "Heart",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 88 C10 60 8 30 26 20 C40 12 50 24 50 32 C50 24 60 12 74 20 C92 30 90 60 50 88 Z"/></svg>`,
  },
  {
    id: "bolt",
    name: "Bolt",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M58 4 L26 56 L46 56 L40 96 L74 40 L52 40 Z"/></svg>`,
  },
  {
    id: "flower",
    name: "Flower",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g><ellipse cx="50" cy="24" rx="15" ry="22"/><ellipse cx="50" cy="24" rx="15" ry="22" transform="rotate(72 50 50)"/><ellipse cx="50" cy="24" rx="15" ry="22" transform="rotate(144 50 50)"/><ellipse cx="50" cy="24" rx="15" ry="22" transform="rotate(216 50 50)"/><ellipse cx="50" cy="24" rx="15" ry="22" transform="rotate(288 50 50)"/><circle cx="50" cy="50" r="11"/></g></svg>`,
  },
  {
    id: "sun",
    name: "Sun",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g><circle cx="50" cy="50" r="20"/><g stroke-width="0"><rect x="47" y="4" width="6" height="16" rx="3"/><rect x="47" y="80" width="6" height="16" rx="3"/><rect x="4" y="47" width="16" height="6" rx="3"/><rect x="80" y="47" width="16" height="6" rx="3"/><rect x="47" y="4" width="6" height="16" rx="3" transform="rotate(45 50 50)"/><rect x="47" y="80" width="6" height="16" rx="3" transform="rotate(45 50 50)"/><rect x="4" y="47" width="16" height="6" rx="3" transform="rotate(45 50 50)"/><rect x="80" y="47" width="16" height="6" rx="3" transform="rotate(45 50 50)"/></g></g></svg>`,
  },
  {
    id: "flame",
    name: "Flame",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M52 4 C52 26 74 34 70 58 C68 74 60 78 60 78 C64 66 56 60 54 52 C50 62 42 62 44 76 C36 70 30 60 32 46 C34 30 52 30 52 4 Z"/></svg>`,
  },
  {
    id: "blob",
    name: "Blob",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M60 8 C82 12 94 34 88 56 C82 78 60 94 40 88 C18 82 6 58 14 38 C22 18 38 4 60 8 Z"/></svg>`,
  },
  {
    id: "moon",
    name: "Moon",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M64 8 A44 44 0 1 0 64 92 A34 34 0 0 1 64 8 Z"/></svg>`,
  },
  {
    id: "arrow",
    name: "Arrow",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M44 12 L44 62 L26 62 L50 92 L74 62 L56 62 L56 12 Z"/></svg>`,
  },
  {
    id: "target",
    name: "Target",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="47" y="6" width="6" height="88" rx="3"/><rect x="6" y="47" width="88" height="6" rx="3"/><circle cx="50" cy="50" r="22" fill="none" stroke-width="6"/></svg>`,
  },
];
