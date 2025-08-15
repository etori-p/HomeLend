import { NextResponse } from 'next/server';
import  connectToMongoDB  from '@/lib/mongodb';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';

export const POST = async (req) => {
  try {
    const { firstName, lastName, emailAddress, password, agreeTS } = await req.json();

    // --- Validate required fields ---
    if (!firstName || !lastName || !emailAddress || !password || !agreeTS) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    if (!agreeTS) {
      return NextResponse.json({ message: 'You must agree to the terms of service' }, { status: 400 });
    }
    
    await connectToMongoDB();
    // --- Validate email format ---
    const existingUser = await User.findOne({ emailAddress });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      emailAddress,
      password: hashedPassword,
      agreeTS,
    });

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });

  } catch (error) {
    console.error('REGISTRATION_ERROR', error.message, error.stack);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};