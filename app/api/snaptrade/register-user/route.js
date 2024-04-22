import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import { Snaptrade } from "snaptrade-typescript-sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import User from "@/models/User";


// This route is used to create a new snaptrade user

export async function POST(req) {
  await connectMongo();

  //Capture the body of the request
  const body = await req.json();

  //If there is no user id passed in the request body, send error
  if (!body._id) {
    return NextResponse.json({ error: "Cannot create a Snaptrade user if customer ID missing" }, { status: 400 });
  }

  try {
    // Sign request with our credentials
    const snaptrade = new Snaptrade({
      clientId: process.env.SNAPTRADE_CLIENT_ID,
      consumerKey: process.env.SNAPTRADE_CONSUMER_KEY,
    });
      
    // Body of the request is the user id. We will need to store the response
    const response = await snaptrade.authentication.registerSnapTradeUser(
      { userId: body._id },
    );

    // Snaptrade returns a user secret unique for this user.
    // We must store the userSecret in the database
    const session = await getServerSession(authOptions);
    const user = await User.findById(session?.user?.id);
    user.snaptrade_user_secret = response.data.userSecret;
    // For me: f74447fd-af2a-4df8-9dbe-89eeb375a23d
    
    console.log(response.data);

    return NextResponse.json({ response: response.data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
