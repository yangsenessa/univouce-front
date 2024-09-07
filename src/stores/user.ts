import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { isDevMode } from '@/utils/env';
import { writeStorage } from '@/utils';

const isDev = isDevMode();

// =========================== 网站相关数据持久化 ===========================

interface AccountState {
  // 登录信息
  jwt_token: string;
  address: string;
  account: string | number;
  setAccount: (user: any) => void;
  setToken: (user_id: string, token: string, address: string) => void;
  clearToken: () => void;
}

export const useAcountStore = create<AccountState>()(
  devtools(
    persist(
      (set) => ({
        // 用户信息
        jwt_token: '',
        account: '',
        address: '',
        setAccount: (user) => {
          set({ account: user });
        },
        setToken: (user_id, token, address) => {
          writeStorage(
            `uni_voice_user_info`,
            JSON.stringify({
              account: user_id,
              address: address,
            }),
          );
          writeStorage(`uni_voice_user_token`, token);

          set({ jwt_token: token, address: address, account: user_id });
        },
        clearToken: () => {
          set({ jwt_token: '', address: '', account: '' });
          writeStorage(`uni_voice_user_token`, '');
          writeStorage(`uni_voice_user_info`, '');
        },
      }),
      {
        name: '__tel_mini_app_uni_voice__',
      },
    ),
    {
      enabled: isDev,
    },
  ),
);

isDev && mountStoreDevtool('AppStore', useAcountStore);
