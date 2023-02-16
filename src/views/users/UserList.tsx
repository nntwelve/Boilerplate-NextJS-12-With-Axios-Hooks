import React from 'react';
import { Alert, CircularProgress, Grid } from '@mui/material';
import useUserList from '@/hooks/users/useGetListUsers';
import { User, UserGetParams } from '@/types/users.type';
import UserListItem from './UserListItem';

type Props = {
  filter: UserGetParams;
  justCreatedUser: User[];
};

function UserList({ filter, justCreatedUser }: Props) {
  const [{ data, error, loading }] = useUserList(filter);

  return (
    <Grid container spacing={2} justifyContent="stretch">
      {loading && (
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      )}

      {error && (
        <Grid item xs={12}>
          <Alert severity="error">{error.message}</Alert>
        </Grid>
      )}

      {!loading && !data?.data?.length && (
        <Grid item xs={12}>
          <Alert severity="warning">{'No data found'}</Alert>
        </Grid>
      )}

      {justCreatedUser.map((user) => (
        <Grid item xs key={user.id}>
          <UserListItem user={user} isNew />
        </Grid>
      ))}

      {data &&
        data.data?.map((user) => (
          <Grid item xs key={user.id}>
            <UserListItem user={user} />
          </Grid>
        ))}
    </Grid>
  );
}

export default UserList;
