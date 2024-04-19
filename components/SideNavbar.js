import Link from 'next/link';
import Image from "next/image";
import NavLinks from '@/components/NavLinks';
import logo from "@/app/icon.png";
import config from "@/config";
import ButtonAccount from './ButtonAccount';


export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-10 items-center justify-center rounded-md bg-gray-100 hover:bg-sky-100 p-4 md:h-20 gap-2"
        href="/dashboard"
      >
        <Image
          src={logo}
          alt={`${config.appName} logo`}
          className="w-12"
          placeholder="blur"
          priority={true}
        />          
        <span className="font-extrabold text-lg">{config.appName}</span>
      </Link>

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks /> {/* See Vercel starter example Nav-links file in Github */}
        <div className="hidden h-auto w-full grow rounded-md bg-gray-100 md:block"></div>
        <form>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <p>Icon here </p>
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}