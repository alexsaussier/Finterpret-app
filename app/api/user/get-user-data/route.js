import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import { Snaptrade } from "snaptrade-typescript-sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import User from "@/models/User";


// This route is to update user db to set wallet imported to true

export async function GET() {
    await connectMongo();
        
    try{
    // update db of current user
    const session = await getServerSession(authOptions);

    const user = await User.findById(session?.user?.id);

    console.log("user data returned: " + user);
    return NextResponse.json({ user: user });

    

    } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
