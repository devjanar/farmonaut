"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('./MapClient'), {
  ssr: false, // This prevents server-side rendering
  loading: () => <div>Loading map...</div>
});

export default function FarmMap() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.newfield.isOpen);

  if (!isOpen) {
    return null; // Don't render anything if the modal is not open
  }

  return (
    <div className='rounded-lg'>
      <Map />
    </div>
  )
}
