// Rasterizes ONE word into a white-on-transparent coverage mask for the chromatic
// glow. The shader treats the white silhouette as the glow SOURCE — it's the bright
// shape the bloom spreads out from. No blur here — the bloom is built on the GPU.

export async function makeWordMask(
  word: string,
  w: number,
  h: number,
  fontFamily: string,
): Promise<HTMLCanvasElement> {
  const W = Math.max(1, Math.round(w));
  const H = Math.max(1, Math.round(h));

  const out = document.createElement("canvas");
  out.width = W;
  out.height = H;
  const ctx = out.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);

  const text = (word || "").trim();
  if (!text) return out;

  const cx = W / 2;
  const cy = H * 0.5;
  const maxW = W * 0.78; // leave room for the bloom + split to spread past the letters

  // A big, bold cap height; shrink to fit the width if the word is long.
  let size = H * 0.42;
  ctx.font = `800 ${size}px ${fontFamily}`;
  const measured = ctx.measureText(text).width;
  if (measured > maxW) {
    size *= maxW / measured;
    ctx.font = `800 ${size}px ${fontFamily}`;
  }

  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // A touch of letter spacing so the glow between letters breathes.
  const ls = size * 0.02;
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) + ls * (chars.length - 1);
  let x = cx - total / 2;
  ctx.textAlign = "left";
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], x, cy);
    x += widths[i] + ls;
  }
  return out;
}
