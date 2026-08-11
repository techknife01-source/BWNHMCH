import { ENV_CONFIG } from '../config/env.config';

export const getAbsolutePdfUrl = (url?: string): string => {
  if (!url || url === '#') return '#';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  const apiBase = ENV_CONFIG.API_BASE_URL || '/api/v1';

  if (apiBase.startsWith('http://') || apiBase.startsWith('https://')) {
    try {
      const origin = new URL(apiBase).origin;
      if (url.startsWith('/api/v1')) {
        return `${origin}${url}`;
      }
      if (url.startsWith('/')) {
        return `${apiBase}${url}`;
      }
      return `${apiBase}/${url}`;
    } catch {
      return url;
    }
  }

  if (url.startsWith('/')) return url;
  return `/${url}`;
};
