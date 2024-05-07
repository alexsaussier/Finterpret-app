"use client";
import { useSession, signIn } from "next-auth/react";
import { getServerSession, getSession} from "next-auth";
import apiClient from "@/libs/api";




const Card = () => {

    
    return (
        <div className="card w-96 bg-base-100 shadow-xl">
            <button >
                <div className="card-body">
                    <h2 className="card-title">Title</h2>
                    
                    <p>List the brokerage accounts that are connected here</p>
                </div>
            </button>
        </div>
    )
};

export default Card;