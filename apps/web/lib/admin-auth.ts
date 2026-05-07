const ADMIN_TOKEN_KEY = 'simeonshop.admin.token';

export const getAdminToken = () => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
};

export const setAdminToken = (token: string) => {
  if (typeof window !== 'undefined') sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const clearAdminToken = () => {
  if (typeof window !== 'undefined') sessionStorage.removeItem(ADMIN_TOKEN_KEY);
};
