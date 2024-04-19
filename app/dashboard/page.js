import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export default async function Dashboard() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);

  return (
    <main className="flex-1 p-4 pb-24">
      <section className="max-w-xl space-y-4">
        <h1 className="text-l md:text-xl font-bold text-left">
          Dashboard
        </h1>
        <p>Welcome {user.name}{user.email} 👋</p>

        <div className="w-full h-screen border border-black border-solid flex flex-col">
          <h1 className="">
            Your holdings
          </h1>
        </div>
      </section>
    </main>
  );
}

