export type IconSize = 16 | 32 | 64 | 96 | 128 | 180 | 192;

export interface GeneratedIcon {
  base64: string;
  mimeType: string;
}

export interface IconGenerationRequest {
  prompt: string;
}

export interface IconGenerationResponse {
  success: boolean;
  image?: GeneratedIcon;
  error?: string;
}

export interface IconGenerationError {
  message: string;
  code?: string;
}

export interface IconHistory {
  id: string;
  prompt: string;
  icon: GeneratedIcon;
  createdAt: string;
}
