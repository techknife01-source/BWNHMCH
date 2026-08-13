import { ENV_CONFIG } from '../config/env.config';

export const getAbsolutePdfUrl = (url?: string): string => {
  if (!url || url === '#') return '#';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  // Preserve relative paths starting with / so requests hit the local applet container server
  if (url.startsWith('/')) return url;

  return `/${url}`;
};
