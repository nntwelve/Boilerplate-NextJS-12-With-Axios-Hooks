import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useCallback, useEffect, useState } from 'react';
import { User, UserGetParams } from '@/types/users.type';
import UserList from '@/views/users/UserList';
import { Container } from '@mui/material';
import Head from 'next/head';

import UserFilter from '@/views/users/UserFilter';

function UserPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<UserGetParams>({});
  const [justCreatedUser, setJustCreatedUser] = useState<User[]>([]);
  const handleChangeFilter = useCallback((newFilter: UserGetParams) => {
    setFilter(newFilter);
  }, []);
  const handleCreatedUser = useCallback((data: User) => {
    setJustCreatedUser((prev) => [data, ...prev]);
  }, []);

  return (
    <>
      <Head>
        <title>{t('Users')}</title>
      </Head>
      <Container maxWidth="xl">
        <UserFilter
          filter={filter}
          onChange={handleChangeFilter}
          onCreatedUser={handleCreatedUser}
        />
        <UserList filter={filter} justCreatedUser={justCreatedUser} />
      </Container>
    </>
  );
}

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default UserPage;
