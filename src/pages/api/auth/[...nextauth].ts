import axios from 'axios';
import jwtDecode from 'jwt-decode';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AppConfig } from '@/configs/app.config';
import GithubProvider from 'next-auth/providers/github';
import { Provider } from 'next-auth/providers';
import { mock_access_token, mock_refresh_token } from '@/mocks/token.mock';

async function refreshAccessToken(token: any) {
  try {
    // Get a new set of tokens with a refreshToken
    // FIXME: UPDATE YOUR LOCAL API HERE
    const token_response = await axios.post(
      'http://localhost:3336/auth/refresh',
      {
        token: token.refresh_token,
      },
      {
        headers: {
          Authorization: `Bearer ${token.refresh_token}`,
        },
      }
    );

    return {
      ...token,
      access_token: token_response.data.access_token,
      access_token_expiry:
        token_response.data.access_token_expiry ||
        jwtDecode<{ exp: number }>(token_response.data.access_token).exp,
      refresh_token: token_response.data.refresh_token,
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

const providers: Provider[] = [
  CredentialsProvider({
    // The name to display on the sign in form (e.g. 'Sign in with...')
    name: 'Credentials',
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      username: { label: 'Username', type: 'username', placeholder: 'jsmith' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials, req) {
      // You need to provide your own logic here that takes the credentials
      // submitted and returns either a object representing a user or value
      // that is false/null if the credentials are invalid.
      // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
      // You can also use the `req` object to obtain additional parameters
      // (i.e., the request IP address)
      try {
        let res;
        if (AppConfig.enableApiMockup) {
          res = {
            status: 200,
            data: {
              access_token: mock_access_token,
              refresh_token: mock_refresh_token,
            },
          };
        } else {
          // FIXME: UPDATE YOUR LOCAL API HERE
          res = await axios.post(`http://localhost:3336/auth/sign-in`, {
            username: credentials?.username,
            password: credentials?.password,
          });
        }
        // If no error and we have user data, return it
        if (res.status === 200) {
          return {
            ...res.data,
            name: credentials?.username,
          };
        }
        // Return null if user data could not be retrieved
        return null;
      } catch (error) {
        return null;
      }
    },
  }),
  GithubProvider({
    clientId: process.env.GITHUB_ID as string,
    clientSecret: process.env.GITHUB_SECRET as string,
  }),
  // ...add more providers here
];

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers,
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
      }
      if (account) {
        if (account.provider === 'github') {
          let res;
          if (AppConfig.enableApiMockup) {
            res = {
              status: 200,
              data: {
                access_token: mock_access_token,
                refresh_token: mock_refresh_token,
              },
            };
          } else {
            res = await axios.post(
              `${AppConfig.apiBase}/github-authentication`,
              {
                access_token: account.access_token,
                token_type: account.token_type,
              }
            );
          }
          token.access_token = res.data.access_token;
          token.refres_token = res.data.refresh_token;
        }
      }
      const decode_token: { exp: number; iat: number } = jwtDecode(
        token.access_token
      );
      const shouldRefreshTime = Math.round(
        decode_token.exp * 1000 - 30 * 60 * 1000 - Date.now()
      );
      // If the token is still valid, just return it.
      if (shouldRefreshTime > 1000) {
        return {
          ...token,
          access_token_expiry: decode_token.exp,
        };
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.access_token = token.access_token;
      session.access_token_expiry = token.access_token_expiry;
      session.error = token.error;
      return session;
    },
  },
};

export default NextAuth(authOptions);
