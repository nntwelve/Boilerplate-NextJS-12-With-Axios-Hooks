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
import React, { useEffect } from 'react';
// form
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '@/types/users.type';
import useCreateUser from '@/hooks/users/useCreateUser';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (data: User) => void;
};

const schema = yup.object().shape({
  first_name: yup.string().min(1).max(40).required(),
  last_name: yup.string().min(1).max(40).required(),
  email: yup.string().min(1).max(1000).email().required(),
});

const defaultValues = {
  first_name: '',
  last_name: '',
  email: '',
};

function UserCreateDialog({ open, onClose, onCreated }: Props) {
  const [{ loading, error }, doCreate] = useCreateUser({
    // mock data
    first_name: '',
    last_name: '',
    email: '',
    avatar: 'https://loremflickr.com/500/500/animals',
    id: 99999 * Math.random(),
  });
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: Partial<User>) => {
    doCreate({ data })
      .then((res) => {
        if (res.status == 201) {
          onClose();
          onCreated({ ...res.data, ...data }); // in real-project, it should be onCreated(res.data);
          reset();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    reset();
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create User</DialogTitle>
      {loading && <LinearProgress />}
      <DialogContent>
        <Box
          id="user-create-form"
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
                  label="First name"
                  onChange={onChange}
                  placeholder="Enter your first name"
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
                  label="Last name"
                  onChange={onChange}
                  placeholder="Enter your last name"
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
          form="user-create-form"
          color="success"
          disabled={loading}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserCreateDialog;
