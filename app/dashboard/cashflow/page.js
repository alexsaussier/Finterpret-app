import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export default async function Dashboard() {
  await connectMongo();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session.user.id);

  return (
    <main className="flex-1 pb-24">
      <section className="max-w-xl space-y-8">

        <h1 className="text-l md:text-xl font-bold text-left">
          Cash Flow Analysis
        </h1>

        <div role="alert" className="alert shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info h-6 w-6 shrink-0">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 className="font-bold">Coming soon in a future release!</h3>
            <div className="text-xs">We aim to display here all future payments to your portfolio: dividend payments and bond payments (once we will support bonds as well). </div>
          </div>
        </div>

      </section>

      
    </main>
  );
}

