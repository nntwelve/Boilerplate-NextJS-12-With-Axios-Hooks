import axios, { AxiosResponse } from 'axios';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const providers = [
  CredentialsProvider({
    // The name to display on the sign in form (e.g. 'Sign in with...')
    name: 'Credentials',
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      email: { label: 'Email', type: 'email', placeholder: 'jsmith' },
      password: { label: 'Password', type: 'password' },
    },
    type: 'credentials',
    async authorize(credentials, req) {
      // You need to provide your own logic here that takes the credentials
      // submitted and returns either a object representing a user or value
      // that is false/null if the credentials are invalid.
      // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
      // You can also use the `req` object to obtain additional parameters
      // (i.e., the request IP address)
      try {
        const res: AxiosResponse<{ token: string; id: string }> =
          await axios.post('https://reqres.in/api/login', {
            email: credentials?.email,
            password: credentials?.password,
          });
        // If no error and we have user data, return it
        if (res.status === 200) {
          return {
            ...res.data,
            email: credentials?.email,
          };
        }
        // Return null if user data could not be retrieved
        return null;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  }),
  // ...add more providers here
];
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers,
  callbacks: {
    async jwt({ token, user }) {
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        token.access_token = `access_${user.token}`;
        token.refres_token = `refresh_${user.token}`;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.access_token = token.access_token;
      return session;
    },
  },
};

export default NextAuth(authOptions);
