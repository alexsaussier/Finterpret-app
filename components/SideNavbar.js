import Link from "next/link";
import Image from "next/image";
import NavLinks from "@/components/NavLinks";
import logo from "@/app/icon.png";
import config from "@/config";
import ButtonAccount from "./ButtonAccount";

export default function SideNav() {
  return (
    <div
      className="flex h-full flex-col px-3 py-4 md:px-2"
      style={{ backgroundColor: "#fff" }}
    >
      <Link
        className="mb-2 flex h-10 items-center justify-center gap-2"
        style={{ backgroundColor: "#fff", color: "#05d8be" }}
        href="/dashboard"
      >
        <span className="font-extrabold text-lg">{config.appName}</span>
      </Link>

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks /> {/* See Vercel starter example Nav-links file in Github */}
        <div
          className="hidden h-auto w-full grow rounded-md md:block"
          style={{ backgroundColor: "#fff" }}
        ></div>
        <form>
          <button
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-base-200 p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3"
            style={{ backgroundColor: "#fff" }}
          >
            <p>Icon here </p>
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
