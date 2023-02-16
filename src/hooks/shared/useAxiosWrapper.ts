import { AxiosRequestConfig } from 'axios';
import useOriginalAxios, { Options, UseAxiosResult } from 'axios-hooks';
import { AppConfig } from '@/configs/app.config';
import useAxiosMockup from './useAxiosMockup';

function useAxios<TResponse = any, TBody = any, TError = any>(
  config: AxiosRequestConfig<TBody> | string,
  options?: Options & { mockData?: TResponse }
): UseAxiosResult<TResponse, TBody, TError> {
  const mockupResult = useAxiosMockup<TResponse>({
    result: options?.mockData,
    manual: options?.manual,
    refetchKey: JSON.stringify(config),
    config: config as AxiosRequestConfig,
  });
  const apiResult = useOriginalAxios<TResponse>(config, {
    ...options,
    manual: AppConfig.enableApiMockup || options?.manual,
  });
  if (AppConfig.enableApiMockup) {
    return mockupResult;
  }
  return apiResult;
}

export default useAxios;
