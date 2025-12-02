"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('./MapControl'), {
  ssr: false
});

export default function MapControl() {
  const isOpen = useSelector((state: RootState) => state.mapcontrol.isOpen);

  if (!isOpen) {
    return null; // Don't render anything if the modal is not open
  }

  return (
    <>
      <Map />
    </>
  )
}
