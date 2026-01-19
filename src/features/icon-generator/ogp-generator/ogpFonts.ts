export type OgpFont =
  | "sans-serif"
  | "serif"
  | "monospace"
  | "gothic"
  | "mincho";

export interface OgpFontOption {
  value: OgpFont;
  label: string;
  fontFamily: string;
}

export const OGP_FONTS: OgpFontOption[] = [
  {
    value: "sans-serif",
    label: "ゴシック（標準）",
    fontFamily: "sans-serif",
  },
  {
    value: "serif",
    label: "明朝",
    fontFamily: "serif",
  },
  {
    value: "monospace",
    label: "等幅",
    fontFamily: "monospace",
  },
  {
    value: "gothic",
    label: "丸ゴシック",
    fontFamily:
      '"Hiragino Maru Gothic ProN", "ヒラギノ丸ゴ ProN W4", sans-serif',
  },
  {
    value: "mincho",
    label: "游明朝",
    fontFamily: '"Yu Mincho", "游明朝", YuMincho, serif',
  },
] as const;
