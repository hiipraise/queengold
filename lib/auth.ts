// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/lib/models/Admin";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        await connectDB();
        const admin = await Admin.findOne({
          email: credentials.email.toLowerCase(),
        });

        if (!admin) return null;

        const valid = await admin.comparePassword(credentials.password);
        if (!valid) return null;

        return {
          id:    String(admin._id),
          email: admin.email,
          name:  admin.name,
          role:  admin.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role  = (user as { role?: string }).role;
        token.email = user.email;
        token.name  = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role  = token.role as string;
        (session.user as { id?: string }).id      = token.sub as string;
      }
      return session;
    },
  },
};
