import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';
import { RefetchOptions, UseAxiosResult } from 'axios-hooks';
import { useCallback, useEffect, useState } from 'react';

type MockupConfigType<T> = {
  result?: T;
  manual?: boolean;
  refetchKey?: string;
  config?: AxiosRequestConfig;
};

function useAxiosMockup<T>({
  result,
  manual = false,
  refetchKey = '',
  config,
}: MockupConfigType<T>): UseAxiosResult<T> {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const refetch = useCallback(
    (
      config1?: AxiosRequestConfig | undefined,
      options?: RefetchOptions | undefined
    ): AxiosPromise<T> => {
      return new Promise((resolve) => {
        setLoading(true);
        setError(null);
        setData(undefined);
        setTimeout(() => {
          setLoading(false);
          setData(result);
          resolve({
            data: result || ({} as T),
            status:
              config?.method == 'POST'
                ? 201
                : config?.method === 'DELETE'
                ? 204
                : 200,
            statusText: '',
            headers: {},
            // @ts-ignore
            config: {},
          });
        }, Math.random() * 3 * 1000);
      });
    },
    [result, config?.method]
  );

  useEffect(() => {
    if (!manual) {
      refetch();
    }
  }, [manual, refetchKey]);

  // @ts-ignore
  return [{ data, loading, error }, refetch, () => undefined];
}

export default useAxiosMockup;
