export const ENV_CONFIG = {
  API_BASE_URL: (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1',
  APP_NAME: (import.meta as any).env?.VITE_APP_NAME || 'Burdwan Homoeopathic Medical College',
  IS_DEV: (import.meta as any).env?.DEV || false,
};
