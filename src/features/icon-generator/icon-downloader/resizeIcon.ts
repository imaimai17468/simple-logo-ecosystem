export async function resizeIcon(
  iconDataUrl: string,
  size: number,
): Promise<string> {
  const img = new window.Image();
  img.src = iconDataUrl;

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  ctx.drawImage(img, 0, 0, size, size);
  return canvas.toDataURL();
}
