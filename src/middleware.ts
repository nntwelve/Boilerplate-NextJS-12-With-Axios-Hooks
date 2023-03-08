import { protected_routes } from './configs/auth.config';

export { default } from 'next-auth/middleware';

export const config = { matcher: protected_routes };
