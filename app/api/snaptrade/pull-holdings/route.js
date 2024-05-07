import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import { Snaptrade } from "snaptrade-typescript-sdk";
import { data } from "autoprefixer";

// This route is used to pull the user holdings
// We need to pass the userId and the snaptrade user secret generated when we registered the user
export async function POST(req) {
  await connectMongo();
  const body = await req.json();

  //If there is no user id passed in the request query, send error
  if (!body.userId) {
    return NextResponse.json(
      { error: "Cannot generate a Snaptrade URI if customer ID missing" },
      { status: 400 }
    );
  }
  if (!body.snaptrade_user_secret) {
    return NextResponse.json(
      {
        error:
          "Cannot generate a Snaptrade URI if snaptrade_user_secret is missing",
      },
      { status: 400 }
    );
  }

  const mockData = {
    holdings: [
      { symbol: "AAPL", quantity: 100 },
      { symbol: "TSLA", quantity: 200 },
    ],
  };

  return NextResponse.json(mockData);
  /*
  try {
    // Sign request with our credentials
    const snaptrade = new Snaptrade({
      clientId: process.env.SNAPTRADE_CLIENT_ID,
      consumerKey: process.env.SNAPTRADE_CONSUMER_KEY,
    });

    // Body of the request is the userId and userSecret.
    const response = await snaptrade.accountInformation.getUserHoldings({
      accountId: "-", //update that with the accountId
      userId: req.query.userId,
      userSecret: req.query.snaptrade_user_secret,
    });

    // Snaptrade returns a redirectURI and a sessionId.
    const redirectURI = response.data.userSecret;
    const sessionId = response.data.sessionId;

    console.log(response.data);
    return NextResponse.json({ redirectURI, sessionId });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }*/
}
