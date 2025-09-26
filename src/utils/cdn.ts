const DEFAULT_CDN = import.meta.env.VITE_CLOUDFRONT_URL?.replace(/\/$/, '') ?? 'https://d3ieyce90rkgk7.cloudfront.net';

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
