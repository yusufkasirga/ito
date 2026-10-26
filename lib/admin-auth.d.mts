export const ADMIN_COOKIE: 'ito_admin';
export const SESSION_SECONDS: 28800;
export function hashPassword(password: string): Promise<string>;
export function verifyPassword(password: unknown, hash: unknown): Promise<boolean>;
export function createSession(secret: string, now?: number): string;
export function verifySession(token: unknown, secret: unknown, now?: number): boolean;
export function acceptsMutation(request: Pick<Request, 'url' | 'headers'>): boolean;
