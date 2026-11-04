import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { connectToDatabase } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { signInSchema, userRoleSchema } from "@/lib/validation";
import { User } from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        await connectToDatabase();
        const user = await User.findOne({ email: parsed.data.email.toLowerCase() })
          .select("+passwordHash")
          .lean();
        if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: userRoleSchema.parse(user.role),
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        const role = userRoleSchema.safeParse(token.role);
        session.user.role = role.success ? role.data : "customer";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
