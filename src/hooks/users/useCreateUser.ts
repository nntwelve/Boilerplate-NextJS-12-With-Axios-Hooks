import { User } from '@/types/users.type';
import useAxios from '@/hooks/shared/useAxiosWrapper';

/**
 * Topic: Manage Users
 *
 * Feature: Create new user
 *
 * @returns
 */
function useCreateUser(mockData?: User) {
  return useAxios<User>(
    {
      method: 'POST',
      url: '/users',
    },
    {
      manual: true,
      mockData,
      autoCancel: false,
    }
  );
}

export default useCreateUser;
