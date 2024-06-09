import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import config from "@/config";
import SideNav from "@/components/SideNavbar";
import ButtonAccount from "@/components/ButtonAccount";

// This is a server-side component to ensure the user is logged in.
// If not, it will redirect to the login page.
// It's applied to all subpages of /dashboard in /app/dashboard/*** pages
// You can also add custom static UI elements like a Navbar, Sidebar, Footer, etc..
// See https://shipfa.st/docs/tutorials/private-page
export default async function LayoutPrivate({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(config.auth.loginUrl);
  }

  return (
    <div className="flex flex-col md:flex-row h-screen md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div
        className="flex-grow p-4 md:overflow-y-auto md:p-6"
        style={{ backgroundColor: "#fafafa" }}
      >
        <div className="flex justify-between items-right pb-4">
          <div className="flex-grow"></div>
          <ButtonAccount /* This should go in SideNav at some point */ />
        </div>

        {children}
      </div>
    </div>
  );
}
