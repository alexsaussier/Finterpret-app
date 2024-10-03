"use client";
import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import config from "@/config";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import "./SideNavbar.css";
import { LogoutIcon } from "@/utils/svgIcons";
import ButtonAccount from "./ButtonAccount";
import ButtonSignOut from "./ButtonSignOut";

export default function SideNav() {
  const { data: session, status } = useSession();

  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div style={{ height: "100%", position: "relative" }}>
      {/* Mobile Header */}
      <div
        className="md:hidden flex justify-between items-center p-4"
        style={{ backgroundColor: "#fff" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="font-extrabold text-lg" style={{ color: "#285A5D" }}>
            {config.appName}
          </span>
        </Link>
        <button
          className="btn btn-square btn-ghost"
          onClick={() => setIsOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Desktop SideNav */}
      <div className="desktopSidebar hidden md:flex h-full flex-col px-3 py-4">
        <div>
          <div className="mb-2 flex items-center justify-center gap-2">
            <Link
              className="flex h-10 items-center justify-center gap-2"
              style={{ backgroundColor: "#fff", color: "#285A5D" }}
              href="/"
            >
              <span className="font-extrabold text-lg">{config.appName}</span>
            </Link>
            <p className="text-sm text-[#05d8be] border border-[#05d8be] rounded-xl p-1">
              BETA
            </p>
          </div>
          <ButtonAccount />
          <div className="flex grow flex-col space-y-2">
            <NavLinks setIsOpen={setIsOpen} />
          </div>
        </div>
        <div className="flex-none">
          <ButtonSignOut />
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-white"
          style={{ maxHeight: "100vh" }}
        >
          <div className="p-4">
            <div className="flex justify-end">
              <button
                className="btn btn-square btn-ghost"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <Link
              className="mb-2 flex h-10 items-center justify-center gap-2"
              style={{ backgroundColor: "#fff", color: "#285A5D" }}
              href="/dashboard"
              onClick={() => setIsOpen(false)}
            >
              <span className="font-extrabold text-lg">{config.appName}</span>
            </Link>

            <div
              className="flex flex-col space-y-2"
              style={{ alignItems: "center" }}
            >
              <ButtonAccount />
              <NavLinks setIsOpen={setIsOpen} />
            </div>

            <div className="mt-4">
              <ButtonSignOut />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
