"use client";
import { useSession, signIn } from "next-auth/react";
import { getServerSession, getSession} from "next-auth";
import apiClient from "@/libs/api";




const StockCard = ({ title, units }) => {

    
    return (
        <div className="card w-96 bg-base-100 shadow-xl">
            <button >
                <div className="card-body">
                    <h2 className="card-title">{title}</h2>
                    
                    <p>{units}</p>
                </div>
            </button>
        </div>
    )
};

export default StockCard;