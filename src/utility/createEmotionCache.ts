import createCache from '@emotion/cache';

const createEmotionCache = () => {
  return createCache({ key: 'mui-style', prepend: true });
};

export default createEmotionCache;
