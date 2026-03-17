const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
const localAssetModules = import.meta.glob('../assets/*', { eager: true, import: 'default' });
const localAssetMap = Object.entries(localAssetModules).reduce((acc, [path, url]) => {
  const normalizedPath = path.replace(/\\/g, '/');
  const filename = normalizedPath.split('/').pop()?.toLowerCase();
  if (filename) acc[filename] = url;
  return acc;
}, {});

export function resolveMediaUrl(value) {
  const raw = String(value || '').trim();

  if (!raw) return '';
  if (/^(https?:)?\/\//i.test(raw)) return raw;
  if (/^(data:|blob:)/i.test(raw)) return raw;

  const normalized = raw.replace(/\\/g, '/');
  const filename = normalized.split('/').pop()?.toLowerCase();

  if (
    normalized.startsWith('/frontend/src/assets/') ||
    normalized.startsWith('frontend/src/assets/') ||
    normalized.startsWith('/src/assets/') ||
    normalized.startsWith('src/assets/')
  ) {
    return filename && localAssetMap[filename] ? localAssetMap[filename] : '';
  }

  if (raw.startsWith('/')) {
    return `${API_BASE}${raw}`;
  }

  if (filename && localAssetMap[filename]) {
    return localAssetMap[filename];
  }

  return `${API_BASE}/assets/${raw.replace(/^assets\//i, '')}`;
}
