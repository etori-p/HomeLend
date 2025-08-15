import { NextResponse } from 'next/server';
import connectToMongoDB from '@/lib/mongodb';
import Houselistpost from "@/app/models/Houselistpost";

export async function GET() {
  try {
    await connectToMongoDB();

    const popularNeighborhoods = await Houselistpost.aggregate([
      {
        $group: {
          _id: '$location',
          count: { $sum: '$favoritesCount' },
          averagePrice: { $avg: '$price' },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 6,
      },
    ]);
    
    const formattedData = popularNeighborhoods.map(item => ({
      location: item._id,
      favoriteCount: item.count,
      averageRent: Math.round(item.averagePrice / 1000) * 1000,
    }));

    return NextResponse.json(formattedData, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Server error fetching popular neighborhoods' }, { status: 500 });
  }
}
