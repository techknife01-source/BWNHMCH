const rawApiUrl = (import.meta as any).env?.VITE_API_URL || (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';
const sanitizedApiUrl = (rawApiUrl && typeof rawApiUrl === 'string' && rawApiUrl.includes('onrender.com')) ? '/api/v1' : rawApiUrl;

export const ENV_CONFIG = {
  API_BASE_URL: sanitizedApiUrl || '/api/v1',
  APP_NAME: (import.meta as any).env?.VITE_APP_NAME || 'BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL',
  IS_DEV: (import.meta as any).env?.DEV || false,
};

