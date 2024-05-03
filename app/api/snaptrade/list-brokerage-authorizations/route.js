import { Snaptrade } from "snaptrade-typescript-sdk";
import { NextResponse } from "next/server";


export async function GET(req) {

    try{
  
        //Capture the body of the request
        const body = await req.json();

        const snaptrade = new Snaptrade({
            clientId: process.env.SNAPTRADE_CLIENT_ID,
            consumerKey: process.env.SNAPTRADE_CONSUMER_KEY,
        });

        const response =
        await snaptrade.connections.listBrokerageAuthorizations(
            {
            userId: body.userId,
            userSecret: body.userSecret,
            },
        );

        console.log(response.data);


        
        return NextResponse.json({ response: response.data });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
    }
