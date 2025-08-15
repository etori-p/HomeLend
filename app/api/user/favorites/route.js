import { NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import User from '@/app/models/User';
import Houselistpost from "@/app/models/Houselistpost";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose'; 

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToMongoDB();
    const user = await User.findOne({ emailAddress: session.user.email }).populate('favoritePosts');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.favoritePosts, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Server error fetching favorites' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = await req.json();

    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ message: 'Invalid Post ID' }, { status: 400 });
    }

    await connectToMongoDB();
    const user = await User.findOne({ emailAddress: session.user.email });
    const post = await Houselistpost.findById(postId);

    if (!user || !post) {
      return NextResponse.json({ message: 'User or Post not found' }, { status: 404 });
    }
    
    const isFavorited = user.favoritePosts.includes(postId);

    if (isFavorited) {
      user.favoritePosts = user.favoritePosts.filter(id => !id.equals(postId));
      await Houselistpost.updateOne(
        { _id: postId },
        { $inc: { favoritesCount: -1 } }
      );
      await user.save();
      return NextResponse.json({ message: 'Removed from favorites', isFavorited: false }, { status: 200 });
    } else {
      user.favoritePosts.push(new mongoose.Types.ObjectId(postId));
      await Houselistpost.updateOne(
        { _id: postId },
        { $inc: { favoritesCount: 1 } }
      );
      await user.save();
      return NextResponse.json({ message: 'Added to favorites', isFavorited: true }, { status: 200 });
    }

  } catch (error) {
    return NextResponse.json({ message: 'Server error during favorite toggle' }, { status: 500 });
  }
}
