const defaultBackendUrl = 'https://smart-homeopathic-college-backend.onrender.com/api/v1';

const rawApiUrl =
  (import.meta as any).env?.VITE_API_URL ||
  (import.meta as any).env?.VITE_API_BASE_URL ||
  defaultBackendUrl;

const sanitizedApiUrl = rawApiUrl && typeof rawApiUrl === 'string'
  ? (rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl)
  : defaultBackendUrl;

export const ENV_CONFIG = {
  API_BASE_URL: sanitizedApiUrl,
  APP_NAME: (import.meta as any).env?.VITE_APP_NAME || 'BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL',
  IS_DEV: (import.meta as any).env?.DEV || false,
};

