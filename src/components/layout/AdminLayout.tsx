"use client";

import { ReactNode, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import MapControl from "@/components/MapControl";

interface AdminLayoutProps {
  children: ReactNode;
  userInfo?: any; 
}

export default function AdminLayout({ children, userInfo }: AdminLayoutProps) {
  
  return (
    <div className="flex h-screen bg-white">
      <Sidebar/>
      <MapControl />
      <div className="flex-1 flex flex-col">
        <Navbar userInfo={userInfo}/>
        <main className="p-4 flex-1 overflow-auto">
          {children}
          </main>
      </div>
    </div>
  );
}