import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import { Snaptrade } from "snaptrade-typescript-sdk";


// This route is used to generate a login link for the user
// We need to pass the userId and the snaptrade user secret generated when we registered the user
export async function POST(req) {
  await connectMongo();

  //Capture the body of the request
  const body = await req.json();
  console.log('body: ' + {body})

  //If there is no user id passed in the request body, send error
  if (!body.userId) {
    return NextResponse.json({ error: "Cannot generate a Snaptrade URI if customer ID missing" }, { status: 400 });
  }
  if (!body.snaptradeUserSecret) {
    return NextResponse.json({ error: "Cannot generate a Snaptrade URI if snaptrade_user_secret is missing" }, { status: 400 });
  }


  try {
    // Sign request with our credentials
    const snaptrade = new Snaptrade({
        clientId: process.env.SNAPTRADE_CLIENT_ID,
        consumerKey: process.env.SNAPTRADE_CONSUMER_KEY,
    });
      
    // Body of the request is the userId and userSecret.
    const response = await snaptrade.authentication.loginSnapTradeUser(
        {
        userId: body.userId,
        userSecret: body.snaptradeUserSecret,
        customRedirect: process.env.NEXTAUTH_URL + "/dashboard"
        },
    );

    // Snaptrade returns a redirectURI and a sessionId.
    console.log(response.data);


    const redirectURI = response.data.redirectURI;
    const sessionId = response.data.sessionId;
    
    console.log(response.data);
    return NextResponse.json({ redirectURI, sessionId });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
