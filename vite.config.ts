// import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ command, mode }) => {
  console.warn('command and mode->', command, mode);

  let devServer = {};
  if (mode === 'development') {
    devServer = {
      server: {
        // Uncomment this line if you want to expose your dev server and access it from the devices
        // in the same network.
        // host: true,
        hmr: true, // 热更新
        proxy: {
          '/api': {
            target: 'http://localhost',
            changeOrigin: true,
            rewrite: (path) => {
              return path;
              // return path.replace(/^\/api/, '');
            },
          },
        },
        cors: true,
        host: '0.0.0.0',
        port: 6868,
      },
    };
  }

  return {
    ...devServer,
    base: '/',
    mode,
    plugins: [
      // Allows using React dev server along with building a React application with Vite.
      // https://npmjs.com/package/@vitejs/plugin-react-swc
      react(),
      // Allows using the compilerOptions.paths property in tsconfig.json.
      // https://www.npmjs.com/package/vite-tsconfig-paths
      tsconfigPaths(),
      // Allows using self-signed certificates to run the dev server using HTTPS.
      // https://www.npmjs.com/package/@vitejs/plugin-basic-ssl
      // basicSsl(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // @符号要解析
        // 配置别名，确保能够找到 Node.js 模块
        // stream: 'stream-browserify',
      },
      extensions: ['.js', '.ts', '.jsx', '.tsx'], // import 可以省略的拓展名
    },
    publicDir: './public',
    envDir: 'env',
  };
});
