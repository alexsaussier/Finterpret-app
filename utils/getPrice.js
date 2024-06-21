import { NextResponse } from "next/server";


export default async function getStats(ticker) {
    // API CALL to retrieve stock metrics
    // BETA, EPS, P/E, ...
    const url = "http://localhost:3000/api/yahoo-finance/price";
  
    const axios = require('axios');

    const options = {
    method: 'GET',
    url: {url} + ticker,
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
  