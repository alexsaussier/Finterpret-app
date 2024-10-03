import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import { Snaptrade } from "snaptrade-typescript-sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import User from "@/models/User";

// This route is used to delete a snaptrade user

export async function POST() {
  await connectMongo();
  // Snaptrade returns a user secret unique for this user.
  // We must store the userSecret in the database
  const session = await getServerSession(authOptions);
  const userId = session.user.id;

  try {
    // Sign request with our credentials
    const snaptrade = new Snaptrade({
      clientId: process.env.SNAPTRADE_CLIENT_ID,
      consumerKey: process.env.SNAPTRADE_CONSUMER_KEY,
    });

    // Body of the request is the user id. We will need to store the response
    const response = await snaptrade.authentication.deleteSnapTradeUser({ userId: session.user.id });
    console.log(response.data);

   
    return NextResponse.json({ response: response.data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
