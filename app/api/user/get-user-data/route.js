import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import { Snaptrade } from "snaptrade-typescript-sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import User from "@/models/User";


// This route is to get user data from db

export async function GET() {
    await connectMongo();
        
    try{
    // update db of current user
    const session = await getServerSession(authOptions);

    const user = await User.findById(session?.user?.id);

    return NextResponse.json({ user: user });

    

    } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
