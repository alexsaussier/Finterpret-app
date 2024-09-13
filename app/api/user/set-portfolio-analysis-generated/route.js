import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import User from "@/models/User";

// This route is to update user db to set wallet imported to true

export async function POST(req) {
	await connectMongo();
	const body = await req.json();
	const { gptAnalysis, forceRefetch } = body;

	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
	}

	try {
		const user = await User.findOne({ email: session.user.email });
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const currentTime = Date.now();
		const currentDate = new Date().toDateString();

		// Reset refresh count if it's a new day
		if (user.analysisRefreshes.lastRefreshDate.toDateString() !== currentDate) {
			user.analysisRefreshes.count = 0;
			user.analysisRefreshes.lastRefreshDate = new Date();
		}

		// Check if user has access or hasn't exceeded refresh limit
		if (!user.hasAccess && user.analysisRefreshes.count >= 3) {
			return NextResponse.json({ error: "Refresh limit exceeded" }, { status: 403 });
		}

		if (forceRefetch || !user.generalAnalysis || currentTime - user.generalAnalysis.timeStamp >= 24 * 60 * 60 * 1000) {
			user.generalAnalysis = {
				gptResponse: gptAnalysis,
				timeStamp: currentTime,
			};
			user.analysisRefreshes.count += 1;
			user.analysisRefreshes.lastRefreshDate = new Date();
			await user.save();
		}

		return NextResponse.json({ 
			message: "Analysis updated successfully",
			refreshesRemaining: user.hasAccess ? 'unlimited' : 3 - user.analysisRefreshes.count
		}, { status: 200 });
	} catch (error) {
		console.error("Error updating user:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
