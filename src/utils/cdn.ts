const DEFAULT_CDN = import.meta.env.VITE_CLOUDFRONT_URL?.replace(/\/$/, '') ?? 'https://d64gsuwffb70l.cloudfront.net';

export const getCdnBase = () => DEFAULT_CDN;

export const buildCdnUrl = (path: string): string => {
  if (!path) {
    return '/placeholder.svg';
  }
  if (/^https?:\/\//.test(path)) {
    return path;
  }
  return `${DEFAULT_CDN}/${path.replace(/^\//, '')}`;
};
