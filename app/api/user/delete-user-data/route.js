import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import { Snaptrade } from "snaptrade-typescript-sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import User from "@/models/User";


// This route is to delete user data in the db 
// just deletes snaptrade data for now

export async function POST() {

    await connectMongo();

        
    try{
    // update db of current user
    const session = await getServerSession(authOptions);

    const user = await User.findById(session?.user?.id);

    //delete the snaptrade_user_secret from the user in the database
    user.snaptrade_user_secret = null;
    user.portfolioAccountId = null;
    user.importedWallet = false;
    await user.save();

    console.log("Snaptrade user data deleted successfully");
    

    return NextResponse.json({ user: user });

    

    } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}