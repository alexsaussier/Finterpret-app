import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import { Snaptrade } from "snaptrade-typescript-sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import User from "@/models/User";


// This route is to update user db to set wallet imported to true

export async function POST() {
    await connectMongo();
        

    try{
    
    // update db of current user
    const session = await getServerSession(authOptions);

    const user = await User.findById(session?.user?.id);

    user.importedWallet = true;
    await user.save();
    console.log("user imported wallet: " + user.importedWallet);

    

    } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
