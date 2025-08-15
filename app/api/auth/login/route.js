import { NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await connectToMongoDB();
    const { emailAddress, password } = await req.json();

    const user = await User.findOne({ emailAddress });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddress,
        image: user.image || '',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
