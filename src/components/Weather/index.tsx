"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import dynamic from 'next/dynamic';
const Weather = dynamic(() => import('./Weather'), {
  ssr: false
});

export default function WeatherReport() {
  const isOpen = useSelector((state: RootState) => state.weather.isOpen);

  if (!isOpen) {
    return null; // Don't render anything if the modal is not open
  }

  return (
    <>
      <Weather />
    </>
  )
}
