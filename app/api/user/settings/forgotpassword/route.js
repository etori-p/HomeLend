import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToMongoDB from '@/lib/mongodb';
import User from '@/app/models/User';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email address is required.' }, { status: 400 });
    }

    await connectToMongoDB();
    const user = await User.findOne({ emailAddress: email });

    if (!user) {
      return NextResponse.json({ message: 'Check your email for a reset password link' }, { status: 200 });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 3600000;

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetTokenExpires;
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/resetpassword/${resetToken}`;
    
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link is valid for 1 hour. If you did not request this, please ignore this email.</p>
      `,
    };

    await sgMail.send(msg);

    return NextResponse.json({ message: 'Check your email for a reset password link' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'An unexpected server error occurred.' }, { status: 500 });
  }
}
