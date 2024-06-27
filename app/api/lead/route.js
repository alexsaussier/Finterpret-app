import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";

// This route is used to store the leads that are generated from the landing page.
// The API call is initiated by <ButtonLead /> component
// Duplicate emails just return 200 OK
export async function POST(req) {
  await connectMongo();

  //Capture the body of the request
  const body = await req.json();

  //If there is no email passed in the request body, send error
  if (!body.email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    //Check if this lead is already in the database
    const lead = await Lead.findOne({ email: body.email });

    //If the lead is not in the database, create a new lead
    if (!lead) {
      await Lead.create({ email: body.email });

      // Here you can add your own logic
      // For instance, sending a welcome email (use the the sendEmail helper function from /libs/mailgun)
    }

    return NextResponse.json({});
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
