import axios from 'axios';

const TOKEN_KEY = 'guesthub_token';

const baseURL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

export function setAuthToken(token: string | null, persistent = false): void {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common.Authorization;
    return;
  }

  if (persistent) {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.removeItem(TOKEN_KEY);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(TOKEN_KEY);
  }

  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function loadAuthToken(): void {
  const token = localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
}

loadAuthToken();
