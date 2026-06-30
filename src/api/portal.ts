import { api, ensureCsrfCookie, resetCsrfCookie } from './client';
import type { DashboardData, PortalUser, SearchFilters } from '../types/portal';

export async function login(username: string, password: string, remember = false): Promise<PortalUser> {
  await ensureCsrfCookie();
  const { data } = await api.post<PortalUser>('/api/portal/login', { username, password, remember });
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/api/portal/logout');
  resetCsrfCookie();
}

export async function fetchUser(): Promise<PortalUser> {
  const { data } = await api.get<PortalUser>('/api/portal/user');
  return data;
}

export async function fetchDashboard(filters: SearchFilters = {}): Promise<DashboardData> {
  const { data } = await api.get<DashboardData>('/api/portal/dashboard', { params: filters });
  return data;
}

export async function submitPrenotazioni(payload: Record<string, unknown>): Promise<{
  success: boolean;
  message: string;
  results: string[];
}> {
  await ensureCsrfCookie();
  const { data } = await api.post('/api/portal/submit', payload);
  return data;
}

export async function fetchStatistics(year?: number): Promise<unknown> {
  const { data } = await api.get('/api/portal/statistics', { params: year ? { year } : {} });
  return data;
}

export async function downloadReceipt(propertyId: number, date: string): Promise<Blob> {
  const { data } = await api.get('/api/portal/receipts/alloggiati-web', {
    params: { property_id: propertyId, date },
    responseType: 'blob',
  });
  return data;
}

export function hasPermission(user: PortalUser | null, permission: string): boolean {
  return !!user?.permissions?.includes(permission);
}
