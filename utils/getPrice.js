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
        return response;

    } catch (e) {
        if (e.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Server responded with an error:", e.response.status, e.response.data);
        } else if (e.request) {
            // The request was made but no response was received
            console.error("No response received for the request:", e.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error setting up the request:", e.message);
        }
        return null; // Return null or appropriate value indicating failure
    }
}
  