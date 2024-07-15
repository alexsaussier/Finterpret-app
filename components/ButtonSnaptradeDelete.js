/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import apiClient from "@/libs/api";
import { useRouter } from "next/navigation";

//A button to delete your existing snaptrade connection
const ButtonSnaptradeDelete = ({
  title = "Delete Snaptrade Connection"
}) => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();



  const handleSnaptrade = async () => {
    //Fetch the snaptrade_user_secret associated to the id of the logged in user
    //if cannot fetch than register user and fetch again
    //store in variable


      
    try{
      await apiClient.post("/snaptrade/delete-snaptrade-user");

        try{
            //delete the snaptrade_user_secret from the user in the database
            fetch('/api/user/delete-user-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            
            router.refresh(); //to refresh the page
            
            window.location.reload(true); //to refresh the page

        } catch(e){
            console.error("Could not delete Snaptrade user from database -" + e);
        }
    } catch(e){
        console.error("Could not delete Snaptrade user -" + e);
    }
    
      
    try{
        //delete the snaptrade_user_secret from the user in the database
        fetch('/api/user/delete-user-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
    } catch(e){
        console.error("Could not delete Snaptrade user from database -" + e);
    }
    
    


  }

  return (
    <button
      className="btn btn-neutral btn-outline animate-shimmer"
      onClick={handleSnaptrade}
    >
      {title}
    </button>
  );
};

export default ButtonSnaptradeDelete;
