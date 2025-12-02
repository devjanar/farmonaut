"use client";
import { useEffect, useState } from "react"
import { Download, Hourglass } from "lucide-react";


export function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 z-10">
      <div className="flex flex-col items-center">
         <Hourglass className="h-10 w-10 text-emerald-600 animate-spin" />
        <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}