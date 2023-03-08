import { protected_routes } from '@/configs/auth.config';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function useAuth(shouldRedirect: boolean) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signOut({
        callbackUrl: `/api/auth/signin?callbackUrl=${router.asPath}`,
        redirect: protected_routes.includes(router.asPath)
          ? shouldRedirect
          : false,
      });
    }

    if (session !== undefined || session !== null) {
      if (router.route === '/api/auth/signin') {
        router.replace('/');
      }
      setIsAuthenticated(true);
    }
  }, [session]);

  return isAuthenticated;
}
