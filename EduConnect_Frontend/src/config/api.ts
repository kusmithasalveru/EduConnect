/**
 * Single source of truth for the backend API base URL.
 *
 * Reads VITE_API_URL only. Do NOT introduce a second variable name
 * (e.g. VITE_API_BASE_URL) - this project previously had both in different
 * files, which meant some requests silently used a different, incorrect
 * default in production. Every file that needs the API base URL should
 * import API_BASE_URL from here instead of reading import.meta.env directly.
 *
 * In dev mode with no VITE_API_URL set, this falls back to the local
 * backend's default port so `npm run dev` still works out of the box.
 * In a production build, a missing VITE_API_URL is a real misconfiguration
 * (it would otherwise silently point at an empty/relative URL), so we warn
 * loudly instead of guessing.
 */
const rawUrl = import.meta.env.VITE_API_URL as string | undefined;

export const API_BASE_URL: string =
    rawUrl ?? (import.meta.env.DEV ? 'http://localhost:8080' : '');

if (!rawUrl && !import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error(
        'VITE_API_URL is not set. API requests will fail. ' +
        'Set VITE_API_URL in the deployment environment (see .env.example).'
    );
}

/**
 * The backend returns server-relative paths for uploaded files (e.g.
 * "/uploads/profile-images/xyz.jpg"). That's correct when frontend and
 * backend share an origin, but in this deployment they are two separate
 * services/origins (static frontend + API backend), so a relative path
 * would resolve against the FRONTEND's origin and 404. This resolves any
 * server-relative path against the API origin. Absolute URLs (http(s)://)
 * and local blob:/data: preview URLs are passed through unchanged.
 */
export function resolveMediaUrl(path?: string): string | undefined {
    if (!path) return path;
    if (/^(https?:|blob:|data:)/i.test(path)) return path;
    if (!API_BASE_URL) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}
