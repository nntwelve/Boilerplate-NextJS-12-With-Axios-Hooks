import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  LinearProgress,
  TextField,
} from '@mui/material';
import React from 'react';
// form
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '@/types/users.type';
import useUserUpdate from '@/hooks/users/useUpdateUser';

type Props = {
  initialData: User;
  open: boolean;
  onClose: () => void;
  onUpdated: (data: User) => void;
};

const schema = yup.object().shape({
  first_name: yup.string().min(5).max(40).required(),
  last_name: yup.string().min(1).max(40).required(),
  email: yup.string().min(1).max(1000).email().required(),
});

function UserEditDialog({ open, onClose, initialData, onUpdated }: Props) {
  const [{ loading, error }, doUpdate] = useUserUpdate(initialData.id);
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: initialData.first_name,
      last_name: initialData.last_name,
      email: initialData.email,
      avatar: initialData.avatar,
    },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: Partial<User>) => {
    doUpdate({ data }).then((res) => {
      if (res.status == 200) {
        onClose();
        onUpdated({ ...res.data, ...data }); // in real-project, it should be onUpdated(res.data);
        reset({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          avatar: data.avatar,
        });
      }
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit User</DialogTitle>
      {loading && <LinearProgress />}
      <DialogContent>
        <Box
          id="user-edit-form"
          component={'form'}
          onSubmit={handleSubmit(onSubmit)}
          mt={2}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller
              name="first_name"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="First Name"
                  onChange={onChange}
                  placeholder="Enter first name"
                  error={Boolean(errors.first_name)}
                />
              )}
            />
            {errors.first_name && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.first_name.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller
              name="last_name"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Last Name"
                  onChange={onChange}
                  placeholder="Enter last name"
                  error={Boolean(errors.last_name)}
                />
              )}
            />
            {errors.last_name && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.last_name.message}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label="Email"
                  onChange={onChange}
                  placeholder="Enter your email address"
                  error={Boolean(errors.email)}
                />
              )}
            />
            {errors.email && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {errors.email.message}
              </FormHelperText>
            )}
          </FormControl>
        </Box>
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
        <Button
          type="submit"
          form="user-edit-form"
          color="success"
          disabled={loading}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserEditDialog;
