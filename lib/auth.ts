import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/lib/models/Admin";
import { Customer } from "@/lib/models/Customer";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        await connectDB();
        const isAdminFlow = credentials.userType === "admin";

        if (isAdminFlow) {
          const admin = await Admin.findOne({ email: credentials.email.toLowerCase() });
          if (!admin) return null;
          const valid = await admin.comparePassword(credentials.password);
          if (!valid) return null;
          return { id: String(admin._id), email: admin.email, name: admin.name, role: admin.role };
        }

        const customer = await Customer.findOne({ email: credentials.email.toLowerCase() });
        if (!customer) return null;
        const valid = await customer.comparePassword(credentials.password);
        if (!valid) return null;

        return {
          id: String(customer._id),
          email: customer.email,
          name: `${customer.firstName} ${customer.lastName}`,
          role: "customer",
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { id?: string }).id = token.sub as string;
      }
      return session;
    },
  },
};
