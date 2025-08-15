import { NextResponse } from "next/server";
import connectToMongoDB from "@/lib/mongodb";
import Houselistpost from "@/app/models/Houselistpost";

export const GET = async (request, { params }) => {
  try {
    const { propertyname } = await params; 

    if (!propertyname) {
      return new NextResponse(JSON.stringify({ message: 'Property name is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await connectToMongoDB();

    const decodedPropertyName = decodeURIComponent(propertyname);
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
    return new NextResponse(JSON.stringify({
      message: 'Failed to fetch property!',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
