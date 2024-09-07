export const getBuildMode = () => {
  const mode = import.meta.env.MODE;
  console.warn('ENV_MODE', import.meta.env.MODE);

  switch (mode) {
    case 'production':
    case 'development':
      return mode;
  }

  console.error(`Unknown mode: ${mode}. Parse backend mode failed.`);
  return 'production';
};

// 是否开发模式
export const isDevMode = (): boolean => getBuildMode() !== 'production';
