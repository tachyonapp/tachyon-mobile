/**
 * Deep-clones a Lottie animation object and replaces all occurrences of a
 * source RGB color (as Lottie 0-1 floats) with a target hex color.
 *
 * Works on both static fills/strokes and animated keyframe values.
 * Matching uses a tolerance of ±0.01 per channel to handle float imprecision.
 */

const TOLERANCE = 0.01;

function hexToLottieRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

function colorMatches(k: number[], target: [number, number, number]): boolean {
  return (
    k.length >= 3 &&
    Math.abs(k[0] - target[0]) < TOLERANCE &&
    Math.abs(k[1] - target[1]) < TOLERANCE &&
    Math.abs(k[2] - target[2]) < TOLERANCE
  );
}

function swapInObject(
  obj: unknown,
  from: [number, number, number],
  to: [number, number, number],
): unknown {
  if (Array.isArray(obj)) {
    return obj.map((item) => swapInObject(item, from, to));
  }
  if (obj !== null && typeof obj === "object") {
    const record = obj as Record<string, unknown>;
    // Static color fill/stroke: { ty: 'fl'|'st', c: { k: [r,g,b,a] } }
    if (
      (record.ty === "fl" || record.ty === "st") &&
      record.c !== null &&
      typeof record.c === "object"
    ) {
      const c = record.c as Record<string, unknown>;
      const k = c.k;
      if (Array.isArray(k) && colorMatches(k as number[], from)) {
        return {
          ...record,
          c: { ...c, k: [...to, k[3] ?? 1] },
        };
      }
      // Animated color: k is an array of keyframes, each with { s: [r,g,b,a] }
      if (Array.isArray(k) && k.length > 0 && typeof k[0] === "object") {
        const newK = (k as Record<string, unknown>[]).map((kf) => {
          const s = kf.s;
          if (Array.isArray(s) && colorMatches(s as number[], from)) {
            return { ...kf, s: [...to, (s as number[])[3] ?? 1] };
          }
          return kf;
        });
        return { ...record, c: { ...c, k: newK } };
      }
    }
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(record)) {
      result[key] = swapInObject(record[key], from, to);
    }
    return result;
  }
  return obj;
}

export function swapLottieColor(
  source: object,
  fromHex: string,
  toHex: string,
): object {
  const from = hexToLottieRgb(fromHex);
  const to = hexToLottieRgb(toHex);
  return swapInObject(source, from, to) as object;
}

export function swapLottieColors(
  source: object,
  replacements: { from: string; to: string }[],
): object {
  return replacements.reduce(
    (acc, { from, to }) => swapLottieColor(acc, from, to),
    source,
  );
}
