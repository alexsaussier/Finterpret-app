/* eslint-disable @next/next/no-img-element */
"use client";

import { signOut } from "next-auth/react";
import { LogoutIcon } from "@/utils/svgIcons";


const ButtonSignOut = () => {
  
    const handleSignOut = () => {
      signOut({ callbackUrl: "/" });
    };

    return (
        <div className="mt-4">
            <form>
            <button
                className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-base-200 p-3 text-sm font-medium"
                style={{ backgroundColor: "#fff" }}
                onClick={handleSignOut}
            >
                <LogoutIcon />
                
                <div>Sign out</div>
            </button>
            </form>
        </div>
        );
    }

    export default ButtonSignOut;

    
