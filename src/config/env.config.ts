export const ENV_CONFIG = {
  API_BASE_URL:
    (import.meta as any).env?.VITE_API_URL ||
    (import.meta as any).env?.VITE_API_BASE_URL ||
    'https://bhmch.onrender.com/api/v1',
  APP_NAME: (import.meta as any).env?.VITE_APP_NAME || 'Burdwan Homeopathic Medical College & Hospital',
  IS_DEV: (import.meta as any).env?.DEV || false,
};

