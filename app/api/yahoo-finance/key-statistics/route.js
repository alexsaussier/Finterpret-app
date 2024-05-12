import { reactStrictMode } from "@/next.config";
import { NextResponse } from "next/server";

export async function POST(req) {

    const axios = require('axios');
    const ticker = req.ticker;

    const options = {
    method: 'GET',
    url: 'https://yahoo-finance127.p.rapidapi.com/key-statistics/{ticker}',
    headers: {
        'X-RapidAPI-Key': '1711b82af6msh56385af4fc7e9bcp1a727fjsn68d544d4551c',
        'X-RapidAPI-Host': 'yahoo-finance127.p.rapidapi.com'
    },
    body: JSON.stringify(ticker), // body data type must match "Content-Type" header

    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
        return NextResponse.json({ response: response.data });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });

    }
    
}