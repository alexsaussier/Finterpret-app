"use client";
import { useSession, signIn } from "next-auth/react";
import { getServerSession, getSession} from "next-auth";
import apiClient from "@/libs/api";




const Card = ({title, user}) => {
        
    const userId = user.id;
    const userSecret = user.snaptrade_user_secret;
    

    const handleClick = async () => {
        
        const response = await apiClient.get("/snaptrade/list-brokerage-authorizations", {
            userId, 
            userSecret
        });
        console.log(response);
    }

    
    return (
        <div className="card w-96 bg-base-100 shadow-xl">
            <button onClick={handleClick}>
                <div className="card-body">
                    <h2 className="card-title">{title}</h2>
                    <p>{""}</p>
                    <p>List the brokerage accounts that are connected here</p>
                </div>
            </button>
           
        </div>
    )
};

export default Card;