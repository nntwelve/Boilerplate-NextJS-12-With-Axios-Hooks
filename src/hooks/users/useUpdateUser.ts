import { mockUsers } from '@/mocks/users.mock';
import { User } from '@/types/users.type';
import useAxios from '@/hooks/shared/useAxiosWrapper';

/**
 * Topic: Manage Users
 *
 * Feature: Modify user data
 *
 * @returns
 */
function useUserUpdate(id: number) {
  return useAxios<User>(
    {
      method: 'PUT',
      url: '/users/' + id,
    },
    {
      manual: true,
      mockData: mockUsers.find((user) => user.id == id),
    }
  );
}

export default useUserUpdate;
