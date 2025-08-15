// app/api/auth/[...nextauth]/route.jsx
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/app/models/User'; 
import connectToMongoDB from '@/lib/mongodb'; 
import bcrypt from 'bcryptjs';

// Define the authOptions object
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectToMongoDB();

        try {
          const user = await User.findOne({ emailAddress: credentials.email });

          if (!user) {
            throw new Error("No user found with this email.");
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            throw new Error("Invalid credentials.");
          }

          // Return user object including the role from your database
          return {
            id: user._id.toString(),
            name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.emailAddress,
            email: user.emailAddress,
            image: user.image || null,
            role: user.role || 'user', 
          };

        } catch (error) {
          console.error("Authorization error:", error.message);
          throw new Error(error.message || "Something went wrong during login.");
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectToMongoDB();

      if (account.provider === 'google') {
        const existingUser = await User.findOne({ emailAddress: user.email });

        if (!existingUser) {
          // Create new user for Google sign-in
          const randomPassword = Math.random().toString(36).slice(-8); 
          const hashedPassword = await bcrypt.hash(randomPassword, 10);

          await User.create({
            firstName: user.name?.split(' ')[0] || '',
            lastName: user.name?.split(' ')[1] || '',
            emailAddress: user.email,
            image: user.image || '',
            agreeTS: true, 
            password: hashedPassword,
            role: 'user', // <<< ADDED: Default role for new Google sign-ups
          });
        } else {
          // Update existing user's image/name if changed via Google, and ensure role exists
          if (existingUser.image !== user.image || existingUser.firstName !== user.name?.split(' ')[0]) {
            existingUser.image = user.image;
            existingUser.firstName = user.name?.split(' ')[0] || existingUser.firstName;
            existingUser.lastName = user.name?.split(' ')[1] || existingUser.lastName;
            // Ensure role is set if it's missing (e.g., for old users without a role field)
            if (!existingUser.role) {
              existingUser.role = 'user';
            }
            await existingUser.save();
          }
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // 'user' is available on first sign in and subsequent API calls
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.role = user.role; 
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.role = token.role; 
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    // signIn: '/auth/signin', // Uncomment and create if you have a custom sign-in page
    // error: '/auth/error',   // Uncomment and create if you have a custom error page
  },
};

// The handler now uses the exported authOptions
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };