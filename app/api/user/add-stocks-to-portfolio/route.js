import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import User from "@/models/User";


export async function POST(ticker, units) {

    await connectMongo();

    //save to mongo
    try{
    
        // update db of current user
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

        user.portfolio.push({ ticker, units });
        await user.save();

        console.log('Portfolio updated successfully');
        return NextResponse.json({ message: 'Portfolio updated successfully' });


    } catch (error) {
        console.error('Error updating portfolio:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });


    }
}