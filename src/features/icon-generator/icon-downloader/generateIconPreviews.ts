import type { IconSize } from "@/entities/icon";
import { resizeIcon } from "./resizeIcon";

export async function generateIconPreviews(
  iconDataUrl: string,
  sizes: IconSize[],
): Promise<Record<number, string>> {
  const previews: Record<number, string> = {};

  for (const size of sizes) {
    previews[size] = await resizeIcon(iconDataUrl, size);
  }

  return previews;
}
