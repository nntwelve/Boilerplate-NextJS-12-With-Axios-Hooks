import { useTranslation } from 'next-i18next';
import {
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import UserCreateDialog from './UserCreateDialog';
import { User, UserGetParams } from '@/types/users.type';
type Props = {
  filter: UserGetParams;
  onChange: (newFilter: UserGetParams) => void;
  onCreatedUser: (data: User) => void;
};

function UserFilter({ filter, onChange, onCreatedUser }: Props) {
  const { t } = useTranslation();
  const [per_page, setLimit] = useState('10');
  const [keyword, setKeyword] = useState('');
  const [openCreate, setOpenCreate] = useState(false);

  const toggleCreate = () => {
    setOpenCreate((prev) => !prev);
  };

  const handleChangePageSize = (e: SelectChangeEvent) => {
    setLimit(e.target.value);
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (keyword != filter.keyword) {
        onChange({ ...filter, keyword });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword, filter, onChange]);

  useEffect(() => {
    if (filter.per_page != parseInt(per_page)) {
      onChange({ ...filter, per_page: parseInt(per_page) });
    }
  }, [filter, per_page, onChange]);

  return (
    <Toolbar disableGutters>
      <Typography
        sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
        variant="h5">
        {t('All Users')}
        <IconButton
          sx={{ marginLeft: 2 }}
          color="primary"
          onClick={toggleCreate}>
          <AddIcon />
        </IconButton>
      </Typography>
      <UserCreateDialog
        open={openCreate}
        onClose={toggleCreate}
        onCreated={onCreatedUser}
      />
      <TextField
        sx={{ marginRight: 2 }}
        size="small"
        placeholder="Search term..."
        value={keyword}
        onChange={handleKeywordChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <FormControl size="small">
        <Select
          value={per_page}
          onChange={handleChangePageSize}
          startAdornment={
            <InputAdornment position="start">Page Size:</InputAdornment>
          }>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={30}>30</MenuItem>
        </Select>
      </FormControl>
    </Toolbar>
  );
}

export default UserFilter;
