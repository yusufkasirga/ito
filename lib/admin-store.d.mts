export type StoreEnvironment = {
  BLOB_READ_WRITE_TOKEN?: string;
  BLOB_STORE_ID?: string;
  VERCEL?: string;
  VERCEL_OIDC_TOKEN?: string;
};
export type GatewayAction = 'rate' | 'create' | 'notify' | 'list' | 'update';
export function storeConfigured(env?: StoreEnvironment): boolean;
export function gateway<T = Record<string, unknown>>(
  action: GatewayAction,
  payload: Record<string, unknown>,
  options?: {
    env?: StoreEnvironment;
    blobImpl?: Pick<typeof import('@vercel/blob'), 'get' | 'put' | 'list'>;
    now?: () => number;
  },
): Promise<T>;
