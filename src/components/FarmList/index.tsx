"use client";

import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// Client-only import
const FarmListModal = dynamic(() => import("./FarmListModal"), { ssr: false });

export default function FarmMapClientOnly() {
  const isOpen = useSelector((s: RootState) => s.farmlist.isOpen);

  // Only render on client after hydration
  return <>{isOpen ? <FarmListModal /> : null}</>;
}
