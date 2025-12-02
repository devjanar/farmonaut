"use client";
import {API} from "@/apiEnv"
import Image from "next/image";
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { closeFarmAdvisor } from "@/store/FarmAdvisorSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


export default function FarmAdvisoryModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.farmadvisor.isOpen);
  const {data} = useSelector((state: RootState) => state.home);
  console.log("Farm Advisory Modal - Home Data:", data);
  const [state, setState] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const getAdvisoryReport = async (param:any) => {
      setLoading(true);
      try {
        setState({});
        const res = await fetch(`${API}/field/getAdvisoryReport`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({data:param}),
        });
        const dataValue = await res.json();
        console.log("Fetched:", dataValue.data);
        if(dataValue.data){
          setState(dataValue.data);
        }
      } catch (error) {
        console.error("Error fetching fields:", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if(!isOpen) return;
    let ignore = false;
    const fetchData = async () => {
      await getAdvisoryReport(data);
      if (ignore) return;
    };
    fetchData();
    return () => {
      ignore = true;
    };
  }, [isOpen,data]);

  if(loading){
    return (
      <Dialog open={isOpen} onOpenChange={() => dispatch(closeFarmAdvisor())}>
        <DialogContent 
          hideClose 
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="w-[95vw] !max-w-none h-[95vh] overflow-hidden
          bg-green-300 dark:bg-gray-800 rounded-md p-2 overflow-y-auto flex items-center justify-center"
        >
          <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Loading Advisory Report...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(closeFarmAdvisor())}>
      <DialogContent 
        hideClose 
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="w-[95vw] !max-w-none h-[95vh] overflow-hidden
        bg-green-300 dark:bg-gray-800 rounded-md p-2 overflow-y-auto"
      >
      <DialogHeader>
          <DialogTitle className='flex item-center justify-end mb-0 pb-0 gap-2'>
          <Button className="bg-teal-500 hover:bg-teal-600 px-3 py-1 rounded-lg text-sm cursor-pointer">
            Request Report
          </Button>
          <Button className="bg-white hover:bg-gray-200 px-3 py-1 rounded-lg text-sm text-gray cursor-pointer border border-gray-300" 
            onClick={() => dispatch(closeFarmAdvisor())}>
            X
          </Button>
        </DialogTitle>
      </DialogHeader>
      {/* <div className="w-full h-[85vh]">
        <iframe
          src={state.jeevnAiReporturl || ""}
          width="100%"
          height="100%"
          className="border-0"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div> */}

      <div className="relative w-full h-[85vh]">
        <iframe
          src={state.jeevnAiReporturl || ""}
          width="100%"
          height="100%"
          className="border-0"
          allowFullScreen
          loading="lazy"
        ></iframe>
        <div className="absolute top-0 left-4 w-[340px] h-[48px] bg-[#016064] dark:bg-gray-800">
          <Image
            src="/innovationghar.png"
            width={148}
            height={48}
            alt="Logo"
            className="max-h-[48px] w-auto h-auto object-contain"
          />
        </div>
        {/* <div
          className="absolute top-0 left-0 w-[340px] h-[48px] bg-[#016064] dark:bg-gray-800"
          style={{ pointerEvents: "none" }}
        /> */}
      </div>

    </DialogContent>
  </Dialog>
  );
}