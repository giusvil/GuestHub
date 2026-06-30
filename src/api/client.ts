import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

let csrfReady = false;

export async function ensureCsrfCookie(): Promise<void> {
  if (csrfReady) {
    return;
  }

  await api.get('/sanctum/csrf-cookie');
  csrfReady = true;
}

export function resetCsrfCookie(): void {
  csrfReady = false;
}
