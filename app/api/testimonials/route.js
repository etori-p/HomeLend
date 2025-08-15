// app/api/testimonials/route.js
import { NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import Testimonial from '@/app/models/Testimonial'; // Import the new Testimonial model
import User from '@/app/models/User'; // Import User model for population
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Adjust path if necessary

// --- GET FUNCTION (Fetch all Testimonials) ---
export async function GET(req) {
  try {
    await connectToMongoDB();
    // Fetch all testimonials and populate the user details
    const testimonials = await Testimonial.find({})
      .populate('userId', 'firstName lastName image') // Only fetch these fields from User
      .sort({ createdAt: -1 }); // Sort by newest first

    return NextResponse.json(testimonials, { status: 200 });

  } catch (error) {
    console.error('API Error (GET /api/testimonials):', error);
    return NextResponse.json({ message: 'Server error fetching testimonials' }, { status: 500 });
  }
}

// --- POST FUNCTION (Submit a new Testimonial) ---
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { rating, comment } = await req.json();

    // Server-side validation
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ message: 'Rating must be a number between 1 and 5' }, { status: 400 });
    }
    if (typeof comment !== 'string' || comment.trim().length === 0) {
      return NextResponse.json({ message: 'Comment cannot be empty' }, { status: 400 });
    }
    if (comment.length > 500) {
      return NextResponse.json({ message: 'Comment exceeds maximum length of 500 characters' }, { status: 400 });
    }

    await connectToMongoDB();
    const user = await User.findOne({ emailAddress: session.user.email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Create new testimonial
    const newTestimonial = await Testimonial.create({
      userId: user._id,
      rating,
      comment,
    });

    // Populate the user data for the response, similar to GET
    const populatedTestimonial = await Testimonial.findById(newTestimonial._id)
      .populate('userId', 'firstName lastName image');

    return NextResponse.json({ message: 'Testimonial submitted successfully', testimonial: populatedTestimonial }, { status: 201 });

  } catch (error) {
    console.error('API Error (POST /api/testimonials):', error);
    return NextResponse.json({ message: 'Server error submitting testimonial' }, { status: 500 });
  }
}