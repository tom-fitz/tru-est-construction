import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Array of allowed admin emails - only these emails can access admin functionality
const ALLOWED_ADMIN_EMAILS = [
  "tpfitz42@gmail.com", 
  "rjtholl@gmail.com", 
  "jmrpop@gmail.com"
];

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: any }) {
      // Only allow sign in if the user's email is in the allowed list
      if (!user.email) {
        return false;
      }
      return ALLOWED_ADMIN_EMAILS.includes(user.email);
    },
    async session({ session, token }: { session: any; token: any }) {
      // Add user ID to session
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      // Add user ID to token
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  session: {
    strategy: 'jwt',
  },
}); 