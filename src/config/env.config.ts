const getInitialApiUrl = () => {
  const envUrl = (import.meta as any).env?.VITE_API_URL || (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    const trimmed = envUrl.trim();
    return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
  }

  const isProd = (import.meta as any).env?.MODE === 'production' || (import.meta as any).env?.PROD;
  if (isProd) {
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      const host = window.location.hostname;
      if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.')) {
        return 'http://localhost:10000/api/v1';
      }
    }
    return 'https://bwnhmch.onrender.com/api/v1';
  }

  return 'http://localhost:10000/api/v1';
};

export const ENV_CONFIG = {
  API_BASE_URL: getInitialApiUrl(),
  APP_NAME: (import.meta as any).env?.VITE_APP_NAME || 'BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL',
  IS_DEV: (import.meta as any).env?.DEV || false,
};

