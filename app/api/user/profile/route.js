// app/api/user/profile/route.js
import { NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import User from '@/app/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "profile_pictures" }, 
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// --- GET FUNCTION (Fetch User Profile) ---
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

    // Return specific profile data including lastNamesUpdate
    return NextResponse.json({
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      image: user.image || '',
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '', 
      lastNamesUpdate: user.lastNamesUpdate ? user.lastNamesUpdate.toISOString() : null, 
    }, { status: 200 });

  } catch (error) {
    console.error('API Error (GET /api/user/profile):', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// --- PUT FUNCTION (Update User Profile) ---
export async function PUT(req) {
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

    const formData = await req.formData();
    const newFirstName = formData.get('firstName');
    const newLastName = formData.get('lastName');
    const dateOfBirthString = formData.get('dateOfBirth');
    const profileImageFile = formData.get('profileImage');

    const errors = {};

    // Validate Date of Birth (18+ years)
    if (!dateOfBirthString) {
      errors.dateOfBirth = 'Date of Birth is required.';
    } else {
      const dob = new Date(dateOfBirthString);
      const today = new Date();
      const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

      if (dob > eighteenYearsAgo) {
        errors.dateOfBirth = 'You must be at least 18 years old.';
      }
    }

    // Handle First Name and Last Name updates with 3-month restriction
    const namesChanged = (newFirstName !== user.firstName || newLastName !== user.lastName);
    const threeMonthsInMs = 3 * 30 * 24 * 60 * 60 * 1000; // Approximate 3 months

    if (namesChanged) {
      if (user.lastNamesUpdate) {
        const lastUpdateDate = new Date(user.lastNamesUpdate);
        const timeSinceLastUpdate = Date.now() - lastUpdateDate.getTime();

        if (timeSinceLastUpdate < threeMonthsInMs) {
          errors.names = 'Names can only be updated once every 3 months.';
        }
      }
      // If names are changing and no restriction, update them
      if (!errors.names) {
        user.firstName = newFirstName;
        user.lastName = newLastName;
        user.lastNamesUpdate = new Date(); 
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ message: 'Validation failed', errors }, { status: 400 });
    }

    // Handle Profile Image update
    let imageUrl = user.image; // Default to existing image
    if (profileImageFile && profileImageFile.size > 0) {
      const arrayBuffer = await profileImageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await uploadToCloudinary(buffer);
      imageUrl = uploadResult.secure_url;
    }

    // Update fields that are always editable
    user.image = imageUrl;
    user.dateOfBirth = new Date(dateOfBirthString);

    await user.save();

    // Return updated user data including the new lastNamesUpdate timestamp
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        image: user.image,
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '',
        lastNamesUpdate: user.lastNamesUpdate ? user.lastNamesUpdate.toISOString() : null,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('API Error (PUT /api/user/profile):', error);
    return NextResponse.json({ message: 'Server error during profile update' }, { status: 500 });
  }
}