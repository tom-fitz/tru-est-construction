import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ALLOWED_EMAILS = process.env.ALLOWED_ADMIN_EMAILS ? process.env.ALLOWED_ADMIN_EMAILS.split(',') : [];

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
      if (ALLOWED_EMAILS.length === 0) return true;
      return ALLOWED_EMAILS.includes(user.email);
    },
  },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
}); 