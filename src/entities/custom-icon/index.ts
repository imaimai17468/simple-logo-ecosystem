export interface GradientHandle {
  id: "start" | "end";
  x: number; // 0-1 相対座標
  y: number; // 0-1 相対座標
  color: string; // Hex color
}

export interface BorderConfig {
  enabled: boolean;
  color: string;
  width: number; // px
}

export type ShapeType = "rectangle" | "triangle" | "circle";

export interface ShapeConfig {
  enabled: boolean;
  type: ShapeType;
  color: string;
  strokeWidth: number; // px
  size: number; // 0.1-1.0 (iconSizeに対する比率)
  rotation: number; // 0-360 degrees
}

export interface TextConfig {
  content: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  color: string;
}

export interface CustomIconConfig {
  iconSize: number;
  gradientHandles: [GradientHandle, GradientHandle];
  border: BorderConfig;
  shape: ShapeConfig;
  text: TextConfig;
}

export const DEFAULT_CUSTOM_ICON_CONFIG: CustomIconConfig = {
  iconSize: 512,
  gradientHandles: [
    { id: "start", x: 0.2, y: 0.2, color: "#8B5CF6" }, // Purple
    { id: "end", x: 0.8, y: 0.8, color: "#EC4899" }, // Pink
  ],
  border: {
    enabled: false,
    color: "#000000",
    width: 4,
  },
  shape: {
    enabled: false,
    type: "rectangle",
    color: "#FFFFFF",
    strokeWidth: 4,
    size: 0.65,
    rotation: 0,
  },
  text: {
    content: "",
    fontSize: 48,
    fontFamily: "system-ui, sans-serif",
    fontWeight: 400,
    color: "#FFFFFF",
  },
};
