import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import User from "@/models/User";


export async function POST(req) {

    await connectMongo();
    const body = await req.json();

    const { ticker, newUnits } = body;


    //save to mongo
    try{

        // Extract numeric value if units is an object
        let numericUnits;
        if (typeof units === 'object' && newUnits !== null && newUnits.value) {
            numericUnits = Number(newUnits.value);
        } else {
            numericUnits = Number(newUnits);
        }

        if (isNaN(numericUnits)) {
            throw new Error('Units must be a numeric value');
        }
    
        // find current user
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
            throw new Error('Session not found or invalid');
        }
        const user = await User.findById(session?.user?.id);
        if (!user) {
            throw new Error('User not found');
        }

        // Initialize portfolio as an empty array if it's undefined
        if (!user.portfolio) {
            user.portfolio = [];
        }

        // Check if the ticker exists in the user's portfolio
        const portfolioItem = user.portfolio.find(item => item.ticker === ticker);



        if (portfolioItem) {
            // Ticker exists, update quantity
            if (numericUnits <= 0) {
                // Remove the entry if the new quantity is 0 or less
                user.portfolio = user.portfolio.filter(item => item.ticker !== ticker);
            }
            else {
                portfolioItem.units = numericUnits; // Update the total units to the new value
            }
        } else {
            // Ticker does not exist, add new entry
            //user.portfolio.push({ ticker, units: numericUnits });
        }



        await user.save();

        console.log('Portfolio updated successfully');
        return NextResponse.json({ message: 'Portfolio updated successfully' });


    } catch (error) {
        console.error('Error updating portfolio:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });


    }
}