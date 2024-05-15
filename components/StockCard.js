"use client";
import { useSession, signIn } from "next-auth/react";
import { getServerSession, getSession } from "next-auth";
import apiClient from "@/libs/api";

const StockCard = ({ title, units }) => {
  return (
    <div className="stats shadow">
  
  <div className="stat">
    <div className="stat-title">{title}</div>
    <div className="stat-value">{units}</div>
    <div className="stat-desc">Some description here</div>
  </div>
  
</div>
  );
};

export default StockCard;
