import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { signIn, signOut, useSession } from 'next-auth/react';
import useAuth from '@/hooks/auth/useAuth';

type Props = {
  children: React.ReactElement;
};

const AppLayout = ({ children }: Props) => {
  const { data: session } = useSession();
  const isAuthenticated = useAuth(true);
  const { t } = useTranslation();
  const navItems = [
    { name: t('Home'), path: '/' },
    { name: t('Users'), path: '/users' },
  ];

  return (
    <>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {navItems.map(({ name, path }) => (
                <Link key={path} href={path} passHref>
                  <Button sx={{ my: 2, color: 'white', display: 'block' }}>
                    {name}
                  </Button>
                </Link>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0, color: 'white' }}>
              {session !== undefined ? (
                session !== null ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Box>{`Hi, ${session.user?.name}`}</Box>
                    <Button color="inherit" onClick={() => signOut()}>
                      {t('Sign Out')}
                    </Button>
                  </Box>
                ) : (
                  <Button color="inherit" onClick={() => signIn()}>
                    {t('Sign In')}
                  </Button>
                )
              ) : (
                ''
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        {isAuthenticated && children}
      </Box>
    </>
  );
};
export default AppLayout;
