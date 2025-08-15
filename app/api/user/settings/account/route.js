// app/api/user/settings/account/route.js
import { NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import User from '@/app/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { signOut } from 'next-auth/react'; // For client-side redirection after deletion

// --- DELETE FUNCTION (Delete Account) ---
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToMongoDB();
    const user = await User.findOneAndDelete({ emailAddress: session.user.email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Important: After deleting the user, invalidate their session.
    // This is handled client-side by NextAuth's signOut, but ensure server-side consistency.
    // For server-side deletion, you might also need to clear cookies if not using NextAuth.
    // With NextAuth, signOut() on the client will handle clearing the session cookie.

    return NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 });

  } catch (error) {

    return NextResponse.json({ message: 'Server error during account deletion' }, { status: 500 });
  }
}