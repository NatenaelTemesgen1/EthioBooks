const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[$()*+./?[\\\]^{|}-]/g, '\\$&')}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { params?: Record<string, string> } = {}
): Promise<T> {
  const { params, ...init } = options;
  let url = `${BASE_URL}${endpoint}`;
  if (params && Object.keys(params).length > 0) {
    const search = new URLSearchParams(params).toString();
    url += (endpoint.includes('?') ? '&' : '?') + search;
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };

  // Double-submit CSRF for cookie-auth requests
  const xsrf = getCookie('XSRF-TOKEN');
  if (xsrf) {
    (headers as Record<string, string>)['x-xsrf-token'] = xsrf;
  }

  const res = await fetch(url, { ...init, headers, credentials: 'include' });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message ?? `Request failed: ${res.status}`);
  }
  return data as T;
}

// Auth is cookie-based (httpOnly). No token storage on the client.
