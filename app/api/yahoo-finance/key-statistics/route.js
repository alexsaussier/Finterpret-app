import { reactStrictMode } from "@/next.config";
import { NextResponse } from "next/server";

export async function POST(req) {

    const axios = require('axios');
    const body = await req.json();

    const ticker = body.ticker;

    const options = {
    method: 'GET',
    url: 'https://yahoo-finance127.p.rapidapi.com/key-statistics/' + ticker,
    headers: {
        'X-RapidAPI-Key': '9bd7bf1ab5msh9844a86da9ae0aap142550jsnbd39264e4217',
        'X-RapidAPI-Host': 'yahoo-finance127.p.rapidapi.com'
    },
    };

    try {
        const response = await axios.request(options);
        return NextResponse.json({ response: response.data });

    } catch (e) {
        console.error("API error: " + e);
        return NextResponse.json({ error: e.message }, { status: 500 });

    }
    
}