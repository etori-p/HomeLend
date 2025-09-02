//app/api/list/route.js
import { NextResponse } from "next/server";
import connectToMongoDB from "@/lib/mongodb";
import Houselistpost from "@/app/models/Houselistpost";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
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

export const GET = async (request) => {
  try {
    await connectToMongoDB();
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    let query = {};
    if (featured === 'true') {
      query.isFeatured = true;
    }

    let posts;
    if (limit) {
      posts = await Houselistpost.find(query).limit(parseInt(limit)).sort({ createdAt: -1 });
    } else {
      posts = await Houselistpost.find(query);
    }

    return new NextResponse(JSON.stringify(posts), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Database Error!', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const POST = async (request) => {
  try {
    const formData = await request.formData();
    const imageUrl = formData.get("img");

    const finalImageUrls = [];

    if (imageUrl) {
      finalImageUrls.push(imageUrl);
    } else {
      for (const [key, value] of formData.entries()) {
        if (key.startsWith("image_file_") && value instanceof File && value.size > 0) {
          const fileBuffer = Buffer.from(await value.arrayBuffer());
          const result = await uploadToCloudinary(fileBuffer);
          finalImageUrls.push(result.secure_url);
        }
      }
    }

    if (finalImageUrls.length === 0 && !imageUrl) {
      return new NextResponse(JSON.stringify({ message: 'At least one image URL or file is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await connectToMongoDB();

    const newPost = new Houselistpost({
      propertyname: formData.get("propertyname"),
      price: formData.get("price"),
      location: formData.get("location"),
      features: JSON.parse(formData.get("features")),
      viewdetails: formData.get("viewdetails"),
      img: finalImageUrls,
      description: formData.get("description"),
      propertytype: formData.get("propertytype"),
      isFeatured: formData.get("isFeatured") === 'true', 
      coordinates: JSON.parse(formData.get("coordinates")),
      agentName: formData.get("agentName") || undefined, 
      agentContactEmail: formData.get("agentContactEmail") || undefined,
      agentContactPhone: formData.get("agentContactPhone") || undefined,
    });

    await newPost.save();

    return new NextResponse(JSON.stringify({ message: "House listing has been created successfully" }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new NextResponse(JSON.stringify({
      message: 'Failed to create post!',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const PUT = async (request) => {
  try {
    await connectToMongoDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse(JSON.stringify({ message: 'Listing ID is required for update.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const formData = await request.formData();

    const currentImageUrls = [];
    const newImageFiles = [];

    for (const [key, value] of formData.entries()) {
        if (key.startsWith("existing_img_") && typeof value === 'string') {
            currentImageUrls.push(value);
        } else if (key.startsWith("image_file_") && value instanceof File && value.size > 0) {
            newImageFiles.push(value);
        } else if (key === 'img' && typeof value === 'string' && value) {
            currentImageUrls.push(value);
        }
    }

    const uploadedNewImageUrls = await Promise.all(
        newImageFiles.map(async (file) => {
            const fileBuffer = Buffer.from(await file.arrayBuffer());
            const result = await uploadToCloudinary(fileBuffer);
            return result.secure_url;
        })
    );

    const finalImageUrls = [...currentImageUrls, ...uploadedNewImageUrls];

    const updateFields = {
      propertyname: formData.get("propertyname"),
      price: formData.get("price"),
      location: formData.get("location"),
      features: JSON.parse(formData.get("features")),
      viewdetails: formData.get("viewdetails"),
      img: finalImageUrls,
      description: formData.get("description"),
      propertytype: formData.get("propertytype"),
      isFeatured: formData.get("isFeatured") === 'true',
      coordinates: JSON.parse(formData.get("coordinates")),
      agentName: formData.get("agentName") || undefined,
      agentContactEmail: formData.get("agentContactEmail") || undefined,
      agentContactPhone: formData.get("agentContactPhone") || undefined,
    };

    const updatedPost = await Houselistpost.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedPost) {
      return new NextResponse(JSON.stringify({ message: 'Listing not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new NextResponse(JSON.stringify({ message: "House listing updated successfully", post: updatedPost }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new NextResponse(JSON.stringify({
      message: 'Failed to update post!',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const DELETE = async (request) => {
  try {
    await connectToMongoDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse(JSON.stringify({ message: 'Listing ID is required for deletion.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const deletedPost = await Houselistpost.findByIdAndDelete(id);

    if (!deletedPost) {
      return new NextResponse(JSON.stringify({ message: 'Listing not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new NextResponse(JSON.stringify({ message: "House listing deleted successfully" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new NextResponse(JSON.stringify({
      message: 'Failed to delete post!',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
