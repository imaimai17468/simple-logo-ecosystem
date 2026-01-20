export function calculateRelativePosition(
  clientX: number,
  clientY: number,
  bounds: DOMRect,
): { x: number; y: number } {
  // マウス座標を相対座標(0-1)に変換
  const x = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width));
  const y = Math.max(0, Math.min(1, (clientY - bounds.top) / bounds.height));

  return { x, y };
}
