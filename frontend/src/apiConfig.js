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

