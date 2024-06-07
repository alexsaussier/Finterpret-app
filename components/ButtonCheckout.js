"use client";

import { useState } from "react";
import apiClient from "@/libs/api";
import config from "@/config";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// This component is used to create Stripe Checkout Sessions
// It calls the /api/stripe/create-checkout route with the priceId, successUrl and cancelUrl
// By default, it doesn't force users to be authenticated. But if they are, it will prefill the Checkout data with their email and/or credit card. You can change that in the API route
// You can also change the mode to "subscription" if you want to create a subscription instead of a one-time payment
const ButtonCheckout = ({ priceId, mode = "payment" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handlePayment = async () => {
    setIsLoading(true);

    if (status === "authenticated") {
      try {
        const res = await apiClient.post("/stripe/create-checkout", {
          priceId,
          mode,
          successUrl: window.location.href,
          cancelUrl: window.location.href,
        });

        window.location.href = res.url;
      } catch (e) {
        console.error(e);
      }
    } else {
      signIn(undefined, { callbackUrl: config.auth.callbackUrl });
    }

    setIsLoading(false);
  };

  return (
    <button
      className="btn btn-primary btn-block group"
      onClick={() => handlePayment()}
      style={{ backgroundColor: "#05d8be", color: "white", border: "none" }}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <></>
      )}
      Get {config?.appName}
    </button>
  );
};

export default ButtonCheckout;
