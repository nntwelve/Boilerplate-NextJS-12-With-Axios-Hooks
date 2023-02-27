import { Token } from '@/types/auth.type';
import useAxios from '@/hooks/shared/useAxiosWrapper';

/**
 * Topic: Manage Auth
 *
 * Feature: Login user
 *
 * @returns
 */
function useLogin(mockData?: Token) {
  return useAxios<Token>(
    {
      method: 'POST',
      url: '/login',
    },
    {
      manual: true,
      mockData,
      autoCancel: false,
    }
  );
}

export default useLogin;
