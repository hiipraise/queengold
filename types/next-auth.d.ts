import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role?: string;
    type?: string;
  }

  interface Session {
    user: {
      id?:    string;
      name?:  string | null;
      email?: string | null;
      role?:  string;
      type?:  string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    type?: string;
  }
}