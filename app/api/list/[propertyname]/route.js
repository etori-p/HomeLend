// app/api/list/[propertyname]/route.js
import { NextResponse } from "next/server";
import connectToMongoDB from "@/lib/mongodb";
import Houselistpost from "@/app/models/Houselistpost";

// --- GET FUNCTION (Fetch single listing by propertyname) ---
export const GET = async (request, { params }) => {
  try {
    const { propertyname } = await params; // Extract propertyname from URL parameters

    if (!propertyname) {
      return new NextResponse(JSON.stringify({ message: 'Property name is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await connectToMongoDB();

    // Decode the propertyname from the URL to handle spaces or special characters
    const decodedPropertyName = decodeURIComponent(propertyname);

    // Find the post by propertyname
    const post = await Houselistpost.findOne({ propertyname: decodedPropertyName });

    if (!post) {
      return new NextResponse(JSON.stringify({ message: 'Property not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new NextResponse(JSON.stringify(post), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Failed to fetch single post by name:", error);
    return new NextResponse(JSON.stringify({
      message: 'Failed to fetch property!',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Note: For PUT and DELETE operations on a single property, it's generally
// safer and more reliable to continue using the unique _id in the URL,
// rather than the propertyname, to avoid ambiguity if names are not unique.
// If you need PUT/DELETE by propertyname, you'd implement similar logic
// to the GET function, but it's not recommended for robust APIs.
