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
function useUserDelete(id: number) {
  return useAxios<User>(
    {
      method: 'DELETE',
      url: '/users/' + id,
    },
    {
      manual: true,
      mockData: mockUsers.find((user) => user.id == id),
    }
  );
}

export default useUserDelete;
