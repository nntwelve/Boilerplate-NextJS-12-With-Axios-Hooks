import { mockUsers } from '@/mocks/users.mock';
import { User, UserGetParams } from '@/types/users.type';
import useAxios from '@/hooks/shared/useAxiosWrapper';

/**
 * Topic: Manage Users
 *
 * Feature: Get list users
 *
 * @returns
 */
function useUserList(params: UserGetParams) {
  const { page = 0, per_page = 10, keyword = '' } = params ?? {};
  return useAxios<{
    data: User[];
    page?: number;
    per_page?: number;
    total?: number;
  }>(
    {
      method: 'GET',
      url: '/users',
      params,
    },
    {
      mockData: {
        data: mockUsers
          .filter((user) =>
            user.email.toLowerCase().includes(keyword.toLowerCase())
          )
          .slice(page, per_page),
      },
    }
  );
}

export default useUserList;
