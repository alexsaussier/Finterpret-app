import { NextResponse } from "next/server";


export default async function getPrice(ticker) {
    // API CALL to retrieve price and delta 

    const axios = require('axios');

    const options = {
    method: 'GET',
    url: "https://yahoo-finance127.p.rapidapi.com/price/" + ticker,
    headers: {
        'X-RapidAPI-Key': '9bd7bf1ab5msh9844a86da9ae0aap142550jsnbd39264e4217',
        'X-RapidAPI-Host': 'yahoo-finance127.p.rapidapi.com'
    },
    };


    try {
        const response = await axios.request(options);
        console.log("Response from getPrice: ") + response;
        return response;

    } catch (e) {
        console.error("API error: " + e);
        return NextResponse.json({ error: e.message }, { status: 500 });

    }
}
  