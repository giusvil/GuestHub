import { api, setAuthToken } from './client';
import type { DashboardData, PortalUser, SearchFilters } from '../types/portal';

type LoginResponse = PortalUser & { token: string };

export async function login(username: string, password: string, remember = false): Promise<PortalUser> {
  const { data } = await api.post<LoginResponse>('/api/portal/login', { username, password, remember });
  setAuthToken(data.token, remember);
  const { token: _token, ...user } = data;
  return user;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/api/portal/logout');
  } finally {
    setAuthToken(null);
  }
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

export function saveReceiptBlob(blob: Blob, date: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ricevuta-aw-${date}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadReceiptFile(propertyId: number, date: string): Promise<void> {
  const blob = await downloadReceipt(propertyId, date);
  saveReceiptBlob(blob, date);
}

export function hasPermission(user: PortalUser | null, permission: string): boolean {
  return !!user?.permissions?.includes(permission);
}
