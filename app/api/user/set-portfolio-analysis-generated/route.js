import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import User from "@/models/User";


// This route is to update user db to set wallet imported to true

export async function POST(gptAnalysis) {
    await connectMongo();
        
    try{
    // update db of current user
    const session = await getServerSession(authOptions);

    const user = await User.findById(session?.user?.id);

    user.generalAnalysis.gptResponse = gptAnalysis;
    user.generalAnalysis.timeStamp = Date.now();
    await user.save();
    console.log("user has generated a general analysis: " + user.generalAnalysis.response);

    

    } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
