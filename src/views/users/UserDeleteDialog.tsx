import useUserDelete from '@/hooks/users/useDeleteUser';
import { User } from '@/types/users.type';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
} from '@mui/material';
import React from 'react';

type Props = {
  data: User;
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
};

function UserDeleteDialog({ data, open, onClose, onDeleted }: Props) {
  const [{ loading, error }, doDelete] = useUserDelete(data.id);

  const handleDelete = () =>
    doDelete().then((res) => {
      if (res.status == 204) {
        onClose();
        onDeleted();
      }
    });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Delete User</DialogTitle>
      {loading && <LinearProgress />}
      <DialogContent>
        <DialogContentText>
          Are you sure to delete{' '}
          <strong>
            {data.first_name} {data.last_name}
          </strong>
          ?
        </DialogContentText>
        {error && (
          <DialogContentText color={'error'}>
            Error: {error.message}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Close
        </Button>
        <Button color="error" disabled={loading} onClick={handleDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserDeleteDialog;
