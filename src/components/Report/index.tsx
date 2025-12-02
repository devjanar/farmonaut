"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import dynamic from 'next/dynamic';
const Report = dynamic(() => import('./Report'), {
  ssr: false
});

export default function ReportResult() {
  const isOpen = useSelector((state: RootState) => state.report.isOpen);

  if (!isOpen) {
    return null; // Don't render anything if the modal is not open
  }

  return (
    <>
      <Report />
    </>
  )
}
