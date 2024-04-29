// pages/api/user/[id].js
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === 'GET') {
    const user = await User.findById(req.query.id).lean();
    user._id = user._id.toString(); // Convert _id from ObjectId to string

    res.status(200).json(user);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}