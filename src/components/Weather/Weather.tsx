"use client";
import {API} from "@/apiEnv"
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { Loader } from "@/components/element";
import WeatherDashboard from "./WeatherDashboard";


export default function WeatherReport() {
  const {data,isOpen} = useSelector((state: RootState) => state.home);
  const [state, setState] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    handleApplyFilter()
    setMounted(true);
  }, []);



  const handleApplyFilter = async () => {
    setLoading(true);

    const formData = {
      ...data
    };

    try {
      const res = await fetch(`${API}/field/getPresentWeather`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        // Parse error response (if available)
        const errData = await res.json().catch(() => null);
        const message = errData?.message || `Request failed with status ${res.status}`;
        throw new Error(message);
      }
      const dataValue = await res.json();
      console.log("Fetched:", dataValue);
      const { data, fieldInfo, message } = dataValue;
      setState(data)
    } catch (error: any) {
      console.error("Error submitting field:", error);
      // alert(error.message || "Unexpected error occurred");
    } 
    finally {
       setLoading(false);
    }
  };


  return (
    <div className="p-6 space-y-6 w-full">
      {
        loading  ?  
        <Loader /> 
        :
        <>
            {state && !loading && <WeatherDashboard data={state} />}
        </>
      }
    </div>
  );
}
