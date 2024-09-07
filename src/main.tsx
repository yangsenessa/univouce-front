import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { TonConnectUIProvider } from '@tonconnect/ui-react';
import WebApp from '@twa-dev/sdk';
import eruda from 'eruda';
// 调试tele 小程序控制台
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { isDevMode } from '@/utils/env';
import App from './App.tsx';
import './index.css';

const isDev = isDevMode();

WebApp.ready();
// 调试
isDev && eruda.init();

const queryClient = new QueryClient();

export const Root = () => {
  // const manifestUrl = useMemo(() => {
  //   return new URL('tonconnect-manifest.json', window.location.href).toString();
  // }, []);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            // algorithm: theme.darkAlgorithm,
            components: {
              Message: {
                /* 这里是你的组件 token */
                contentBg: '#24232A',
              },
            },
          }}
        >
          <App />
        </ConfigProvider>
      </QueryClientProvider>
      {/* <TonConnectUIProvider
        manifestUrl={manifestUrl}
        actionsConfiguration={{
          twaReturnUrl: 'https://t.me/TorliBlogBot/univoice',
        }}
      ></TonConnectUIProvider> */}
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
