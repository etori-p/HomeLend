import { NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; 

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword, confirmNewPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return NextResponse.json({ message: 'All password fields are required' }, { status: 400 });
    }
    if (newPassword !== confirmNewPassword) {
      return NextResponse.json({ message: 'New password and confirmation do not match' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ message: 'New password must be at least 6 characters long' }, { status: 400 });
    }

    await connectToMongoDB();
    const user = await User.findOne({ emailAddress: session.user.email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.password) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ message: 'Current password is incorrect' }, { status: 401 });
      }
    } else {
      return NextResponse.json({ message: 'Password cannot be reset for this account type. Please use your social login provider.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Server error during password reset' }, { status: 500 });
  }
}
