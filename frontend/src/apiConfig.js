const rawApi = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '');

export const API_BASE = rawApi.endsWith('/api/v1')
  ? rawApi
  : rawApi.endsWith('/v1')
    ? rawApi.replace(/\/v1$/, '/api/v1')
    : `${rawApi}/api/v1`;

const rawWs = (import.meta.env.VITE_WS_URL || 'ws://localhost:8000/api/v1').replace(/\/$/, '');
export const WS_BASE = rawWs.endsWith('/api/v1')
  ? rawWs
  : rawWs.endsWith('/v1')
    ? rawWs.replace(/\/v1$/, '/api/v1')
    : `${rawWs}/api/v1`;

export const api = {
  get: async (url, options = {}) => {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };
    const res = await fetch(fullUrl, { ...options, method: 'GET', headers });
    const data = await res.json().catch(() => ({}));
    return { data, status: res.status, ok: res.ok };
  },
  post: async (url, body, options = {}) => {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };
    const res = await fetch(fullUrl, {
      ...options,
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    return { data, status: res.status, ok: res.ok };
  }
};

export default api;
