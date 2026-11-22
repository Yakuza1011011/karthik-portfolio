// A steady cruise between cosine ramps avoids rushing through the middle pages.
// Position, velocity and acceleration remain continuous at both ramp boundaries.
export function returnScrollEase(progress) {
  const t = Math.min(1, Math.max(0, progress));
  const ramp = 0.22;
  const edge = x => (x - ramp / Math.PI * Math.sin(Math.PI * x / ramp)) / (2 * (1 - ramp));
  if (t < ramp) return edge(t);
  if (t > 1 - ramp) return 1 - edge(1 - t);
  return (t - ramp / 2) / (1 - ramp);
}
