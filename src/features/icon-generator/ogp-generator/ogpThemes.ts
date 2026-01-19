export type OgpTheme = "light" | "dark";

export interface OgpThemeColors {
  background: string;
  text: string;
}

export const OGP_THEMES: Record<OgpTheme, OgpThemeColors> = {
  light: {
    background: "#ffffff",
    text: "#000000",
  },
  dark: {
    background: "#1a1a1a",
    text: "#ffffff",
  },
} as const;
