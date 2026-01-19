export async function downloadIconAsBlob(
  dataUrl: string,
  filename: string,
): Promise<void> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
