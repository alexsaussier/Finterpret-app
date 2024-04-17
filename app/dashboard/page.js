import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import ButtonGradient from "@/components/ButtonGradient";

export default async function Dashboard() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);

  return (
    <main className="flex-1 p-8 pb-24">
      <section className="max-w-xl space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold text-left">
          Dashboard
        </h1>
        <p>Welcome {user.name} 👋</p>
        <p>Your email is {user.email}</p>
        <ButtonGradient />
      </section>
    </main>
  );
}

