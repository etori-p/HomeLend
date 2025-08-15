// app/api/popular-neighborhoods/route.js
import { NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import Houselistpost from "@/app/models/Houselistpost";

export async function GET() {
  try {
    await connectToMongoDB();

    const popularNeighborhoods = await Houselistpost.aggregate([
      {
        // Group all house posts by their 'location'
        $group: {
          _id: '$location', // The neighborhood name becomes the _id
          count: { $sum: '$favoritesCount' }, // Sum the favoritesCount for each neighborhood
          averagePrice: { $avg: '$price' }, // Calculate the average price
        },
      },
      {
        // Sort the results in descending order by the total count
        $sort: { count: -1 },
      },
      {
        // Limit the results to the top 6 neighborhoods
        $limit: 6,
      },
    ]);
    
    // Format the output to be more readable for the frontend
    const formattedData = popularNeighborhoods.map(item => ({
      location: item._id,
      favoriteCount: item.count,
      averageRent: Math.round(item.averagePrice / 1000) * 1000,
    }));

    return NextResponse.json(formattedData, { status: 200 });

  } catch (error) {
    console.error('API Error (GET /api/popular-neighborhoods):', error);
    return NextResponse.json({ message: 'Server error fetching popular neighborhoods' }, { status: 500 });
  }
}