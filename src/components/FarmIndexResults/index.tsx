"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import dynamic from 'next/dynamic';
const FarmIndexResult = dynamic(() => import('./FarmIndexResults'), {
  ssr: false
});

export default function FarmIndexResults() {
  const isOpen = useSelector((state: RootState) => state.farmindexresult.isOpen);

  if (!isOpen) {
    return null; // Don't render anything if the modal is not open
  }

  return (
    <>
      <FarmIndexResult />
    </>
  )
}
