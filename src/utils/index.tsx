import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 读取存储的值
export const readStorage = (key: string): string | undefined => {
  const r = localStorage.getItem(key);
  if (r == null) return undefined;
  return r;
};

// 写入值
export const writeStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

// 显示简短的文本
export const shrinkText = (
  text: string | undefined,
  prefix = 5,
  suffix = 5,
): string | undefined => {
  if (!text) return text;
  const max_length = prefix + 3 + suffix; // 保留的字符串长度
  if (text.length <= max_length) return text;
  const prefix_text = prefix === 0 ? '' : text.slice(0, prefix); // 前面取

  const suffix_text = suffix === 0 ? '' : text.slice(-suffix); // 后面取
  return `${prefix_text}...${suffix_text}`; // 中间加上省略号
};
