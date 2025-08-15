// app/api/user/settings/newsletter/route.js
import { NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import User from '@/app/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; 

// --- GET FUNCTION (Fetch Newsletter Subscription Status) ---
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToMongoDB();
    const user = await User.findOne({ emailAddress: session.user.email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ isSubscribed: user.isSubscribedToNewsletter }, { status: 200 });

  } catch (error) {
    console.error('API Error (GET /api/user/settings/newsletter):', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// --- PUT FUNCTION (Update Newsletter Subscription Status) ---
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { isSubscribed } = await req.json();

    if (typeof isSubscribed !== 'boolean') {
      return NextResponse.json({ message: 'Invalid subscription status' }, { status: 400 });
    }

    await connectToMongoDB();
    const user = await User.findOne({ emailAddress: session.user.email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    user.isSubscribedToNewsletter = isSubscribed;
    await user.save();

    return NextResponse.json({ message: 'Subscription updated successfully', isSubscribed: user.isSubscribedToNewsletter }, { status: 200 });

  } catch (error) {
    console.error('API Error (PUT /api/user/settings/newsletter):', error);
    return NextResponse.json({ message: 'Server error during newsletter update' }, { status: 500 });
  }
}
