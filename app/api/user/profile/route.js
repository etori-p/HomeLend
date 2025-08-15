import { NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import User from '@/app/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    return NextResponse.json({
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      image: user.image || '',
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '', 
      lastNamesUpdate: user.lastNamesUpdate ? user.lastNamesUpdate.toISOString() : null, 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

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

    const namesChanged = (newFirstName !== user.firstName || newLastName !== user.lastName);
    const threeMonthsInMs = 3 * 30 * 24 * 60 * 60 * 1000;

    if (namesChanged) {
      if (user.lastNamesUpdate) {
        const lastUpdateDate = new Date(user.lastNamesUpdate);
        const timeSinceLastUpdate = Date.now() - lastUpdateDate.getTime();

        if (timeSinceLastUpdate < threeMonthsInMs) {
          errors.names = 'Names can only be updated once every 3 months.';
        }
      }
      if (!errors.names) {
        user.firstName = newFirstName;
        user.lastName = newLastName;
        user.lastNamesUpdate = new Date(); 
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ message: 'Validation failed', errors }, { status: 400 });
    }

    let imageUrl = user.image;
    if (profileImageFile && profileImageFile.size > 0) {
      const arrayBuffer = await profileImageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await uploadToCloudinary(buffer);
      imageUrl = uploadResult.secure_url;
    }

    user.image = imageUrl;
    user.dateOfBirth = new Date(dateOfBirthString);

    await user.save();

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
    return NextResponse.json({ message: 'Server error during profile update' }, { status: 500 });
  }
}
