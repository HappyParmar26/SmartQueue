import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { clsx } from "clsx";
import AuthDialog from "../components/auth/AuthDialog";

export default function Home() {
  const [authOpen, setAuthOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900 ">
    <AuthDialog isOpen={authOpen} onClose={()=>setAuthOpen(false)}/>
    </div>
  );
}

