import 'src/configs/axios.config';
import 'src/styles/globals.css';
import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';

import createEmotionCache from 'src/utility/createEmotionCache';
import lightThemeOptions from 'src/styles/theme/light-theme-option';
import { appWithTranslation } from 'next-i18next';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type ExtendedAppProps = AppProps & {
  Component: NextPage;
  emotionCache?: EmotionCache;
};

const lightTheme = createTheme(lightThemeOptions);

function App({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps: { session, ...pageProps },
}: ExtendedAppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={lightTheme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default appWithTranslation(App);
