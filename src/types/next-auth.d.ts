import NextAuth, { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    access_token: string;
    access_token_expiry: number;
    error: string;
    user: User;
  }
  interface User {
    access_token: string;
    refresh_token: string;
    username: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string;
    access_token_expiry: number;
    refresh_token: string;
    error: string;
  }
}
