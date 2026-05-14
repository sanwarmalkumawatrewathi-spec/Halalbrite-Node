export const getImageUrl = (url: any) => {
  if (!url || typeof url !== 'string') return undefined;
  if (url.startsWith('http') || url.startsWith('blob:')) return url;
  
  const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};
