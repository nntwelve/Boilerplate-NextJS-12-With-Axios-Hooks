import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material';
import { User } from '@/types/users.type';
import { useRouter } from 'next/router';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UserEditDialog from './UserEditDialog';
import UserDeleteDialog from './UserDeleteDialog';

type Props = {
  user: User;
  isNew?: boolean;
};

function UserListItem({ user, isNew = false }: Props) {
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [visible, setVisible] = useState(true);
  const [data, setData] = useState(user);

  const toggleEdit = () => {
    setOpenEdit((prev) => !prev);
  };

  const toggleDelete = () => {
    setOpenDelete((prev) => !prev);
  };

  const toggleVisible = () => {
    setVisible((prev) => !prev);
  };

  const handleItemClick = () => {
    router.push(`/users/${user.id}`);
  };

  const handleUpdatedProduct = (newData: User) => {
    setData(newData);
  };

  return (
    <Collapse in={visible}>
      <Card sx={{ minWidth: 300 }}>
        <CardActionArea
          onClick={handleItemClick}
          sx={{ backgroundColor: 'primary.main' }}>
          <CardMedia component={'img'} image={data.avatar} height="180" />
          {isNew && (
            <Chip
              label="Just Created"
              color="warning"
              size="small"
              sx={{ position: 'absolute', top: 12, right: 12 }}
            />
          )}
        </CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5">
            {data.first_name} {data.last_name}
          </Typography>
          <Typography>${data.email}</Typography>
        </CardContent>
        <CardActions>
          <Button startIcon={<EditIcon />} onClick={toggleEdit}>
            Edit
          </Button>
          <Button
            color="error"
            startIcon={<DeleteIcon />}
            onClick={toggleDelete}>
            Delete
          </Button>
          <Box flexGrow={1} />
        </CardActions>
        <UserEditDialog
          open={openEdit}
          onClose={toggleEdit}
          initialData={data}
          onUpdated={handleUpdatedProduct}
        />
        <UserDeleteDialog
          open={openDelete}
          onClose={toggleDelete}
          onDeleted={toggleVisible}
          data={data}
        />
      </Card>
    </Collapse>
  );
}

export default UserListItem;
