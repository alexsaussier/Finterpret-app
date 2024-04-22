/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import config from "@/config";
import { useState } from "react";
import apiClient from "@/libs/api";

// A simple button to sign in with our providers (Google & Magic Links).
// It automatically redirects user to callbackUrl (config.auth.callbackUrl) after login, which is normally a private page for users to manage their accounts.
// If the user is already logged in, it will show their profile picture & redirect them to callbackUrl immediately.
const ButtonSignin = ({ title = "Import portfolio" }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);


  const handleSnaptrade = async () => {
    setIsLoading(true);

    console.log(session.user);
    //Check if user is registered with snaptrade
    if(!session.user.snaptrade_user_secret) {
      try {
        await apiClient.post("/snaptrade/register-user", {
          _id: session.user.id
        });
      } catch (e) {
        console.error(e);
      }
    }

    if (status === "authenticated") {
      try {
        const result = await apiClient.post("/snaptrade/redirect-URI", {
          userId: session.user.id, 
          userSecret: session.user.snaptrade_user_secret
        });
  
        window.location.href = result.redirectURI;
      } catch (e) {
        console.error(e);
      }

    } else {
      signIn(undefined, { callbackUrl: config.auth.callbackUrl });
    }

    setIsLoading(false);
  };

  

  return (
    <button className="btn btn-gradient animate-shimmer" onClick={handleSnaptrade}>
      {title}
    </button>
  );
};

export default ButtonSignin;
