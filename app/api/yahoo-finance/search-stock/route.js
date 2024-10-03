import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');

    if (!ticker) {
        return NextResponse.json({ error: 'Ticker parameter is required' }, { status: 400 });
    }

    const url = `https://yahoo-finance127.p.rapidapi.com/search/${ticker}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'yahoo-finance127.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
    }
}