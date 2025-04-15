import NextAuth, { AuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

// Extend the default session user type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
    };
  }

  interface User {
    id: string;
    email: string;
  }
}

// Extend the default JWT token type
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
  }
}

// Type conversion function
function convertToNextAuthUser(user: {
  id: string;
  email: string;
}): NextAuthUser {
  return {
    id: user.id.toString(),
    email: user.email,
  };
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing email or password");
          return null;
        }

        console.log("Credentials received:", credentials);

        // console.log("Database URL:", process.env.DATABASE_URL);

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        console.log("User fetched from database:", user);

        if (!user) {
          console.error("No user found with this email");
          return null;
        }

        const isCorrect = await bcrypt.compare(
          credentials.password,
          user.password!
        );
        console.log("Password match:", isCorrect);

        if (!isCorrect) {
          console.error("Incorrect password");
          return null;
        }

        return convertToNextAuthUser(user);
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: {
              email: user.email!,
            },
          });

          if (!existingUser) {
            // Create new user if they don't exist (not ordered as guest)
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name ?? user.email!,
                image: user.image,
              },
            });
          } else if (
            existingUser.name === "Guest User" ||
            !existingUser.image
          ) {
            // Update user if they exist but have missing data (from guest checkout)
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                name:
                  existingUser.name === "Guest User"
                    ? user.name ?? user.email!
                    : existingUser.name,
                image: existingUser.image ?? user.image,
              },
            });
          }
        } catch (error) {
          console.error("Error during Google sign in:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        // Directly assign the original user ID
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // Directly pass the token ID to session
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
};
