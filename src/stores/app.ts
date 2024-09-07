import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { isDevMode } from '@/utils/env';

const isDev = isDevMode();

// =========================== 网站相关数据持久化 ===========================

interface AppState {
  // 页面主题
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // 页面主题
        // theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
        theme: 'light', // ? 暂时只支持 light
        setTheme: (theme: 'light' | 'dark') => set({ theme }),
      }),
      {
        name: '__telegram_mini_app__',
      },
    ),
    {
      enabled: isDev,
    },
  ),
);

isDev && mountStoreDevtool('AppStore', useAppStore);
