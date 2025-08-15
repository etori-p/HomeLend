import { NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(req) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ message: 'Token and new password are required.' }, { status: 400 });
    }
    
    if (newPassword.length < 6) {
      return NextResponse.json({ message: 'New password must be at least 6 characters long.' }, { status: 400 });
    }

    await connectToMongoDB();
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired password reset token.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return NextResponse.json({ message: 'Your password has been reset successfully.' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'An unexpected server error occurred.' }, { status: 500 });
  }
}
