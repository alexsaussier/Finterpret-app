import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import getMarketMetrics from "@/utils/getMarketMetrics";

export async function GET() {
	await connectMongo();
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const marketMetrics = await getMarketMetrics();
		return NextResponse.json(marketMetrics);
	} catch (error) {
		console.error("Failed to fetch market metrics", error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
