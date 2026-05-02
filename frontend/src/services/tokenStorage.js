const TOKEN_KEY = 'kaleido_session';

export const setSessionToken = (token) => {
  const data = {
    token,
    createdAt: Date.now()
  };
  localStorage.setItem(TOKEN_KEY, JSON.stringify(data));
};

export const getSessionToken = () => {
  const data = localStorage.getItem(TOKEN_KEY);
  if (!data) return null;
  
  const parsed = JSON.parse(data);
  if (isTokenExpired(parsed.createdAt)) {
    clearSession();
    return null;
  }
  return parsed.token;
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isTokenExpired = (createdAt) => {
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - createdAt > sevenDaysInMs;
};
