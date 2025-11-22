import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";



import { User } from "./auth/user.model";
import dbConnect from "./lib/mongodb";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await dbConnect();

        // 1) Find user in MongoDB
        const user = await User.findOne({ email: credentials?.email , password:credentials?.password  });

        if (!user) {
          return null; // email not found
        }


        // 3) Return user object (this becomes session.user)
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
});
