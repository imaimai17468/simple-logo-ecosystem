const MIN_SIZE = 1;
const MAX_SIZE = 2048;

export interface IconSizeValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateIconSize(size: string): IconSizeValidationResult {
  if (!size.trim()) {
    return {
      isValid: false,
      error: "サイズを入力してください",
    };
  }

  const numSize = Number(size);

  if (Number.isNaN(numSize) || !Number.isInteger(numSize)) {
    return {
      isValid: false,
      error: "整数を入力してください",
    };
  }

  if (numSize < MIN_SIZE || numSize > MAX_SIZE) {
    return {
      isValid: false,
      error: `${MIN_SIZE}〜${MAX_SIZE}pxの範囲で入力してください`,
    };
  }

  return {
    isValid: true,
  };
}
