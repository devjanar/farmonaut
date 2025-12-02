"use client";
import { API } from "@/apiEnv";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import * as d3 from "d3";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/element";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


export default function Report() {
  const { data } = useSelector((state: RootState) => state.home);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    handleApplyFilter();
  }, []);

  const handleApplyFilter = async () => {
    setLoading(true);

    const formData = {
      ...data
    };

    try {
      const res = await fetch(`${API}/field/getFieldReport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

        if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const message = errData?.message || `Request failed with status ${res.status}`;
        throw new Error(message);
      }

      const result = await res.json();

      setReportData(result);
      setShowModal(true);
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
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* === Modal === */}
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent
              hideClose
              onInteractOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
              className="w-[95vw] !max-w-none h-[95vh] overflow-hidden
                         bg-green-300 dark:bg-gray-800 rounded-md p-2 overflow-y-auto"
            >
              <DialogHeader>
                <DialogTitle className="flex items-center justify-end mb-0 pb-0 gap-2">
                  <Button
                    className="bg-teal-500 hover:bg-teal-600 px-3 py-1 rounded-lg text-sm cursor-pointer"
                  >
                    Request Report
                  </Button>
                  <Button
                    className="bg-white hover:bg-gray-200 px-3 py-1 rounded-lg text-sm text-gray cursor-pointer border border-gray-300"
                    onClick={() => setShowModal(false)} 
                  >
                    X
                  </Button>
                </DialogTitle>
              </DialogHeader>

              <div className="relative w-full h-[85vh]">
                <iframe
                  src={reportData?.advisoryReport?.jeevnAiReporturl || null}
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

          {/* === Main Content (shown only after modal closes) === */}

          <div className="flex w-full h-screen bg-white p-4 gap-4">
            {/* Left Sidebar */}
            <div className="w-1/5 flex flex-col justify-between">
              <div>
                <div className="bg-green-100 rounded-2xl shadow-lg p-4 text-center border-b pb-2 mb-3">
                  <h2 className="font-semibold text-lg">Farm Advisory Report</h2>
                  <div className="flex m-auto text-center justify-center max-h-[90px]">
                    <Image
                      src="/innovationghar.png"
                      width={148}
                      height={48}
                      alt="Logo"
                      className="rounded-full max-h-[90px] w-auto h-auto object-contain"
                    />
                  </div>
                  <Button className="
                      bg-green-500 hover:bg-green-600 
                      text-white font-semibold cursor-pointer
                      text-sm sm:text-base
                      p-4 sm:p-4 lg:p-4
                      rounded-4xl
                      w-full max-w-[90%] sm:max-w-[400px] lg:max-w-[500px]
                      transition-all duration-300
                    ">
                    Click To View
                    </Button>
                </div>

                <div className="bg-green-100 rounded-2xl shadow-lg p-4 text-center border-b pb-2 mb-3">
                  <h3 className="font-semibold text-lg mb-3">Detailed Scientific Report for All Fields</h3>
                  <Button className="
                      bg-green-500 hover:bg-green-600 
                      text-white font-semibold cursor-pointer
                      text-sm sm:text-base
                      p-4 sm:p-4 lg:p-4
                      rounded-4xl mb-4
                      w-full max-w-[90%] sm:max-w-[400px] lg:max-w-[500px]
                      transition-all duration-300
                    ">
                      Request New Data
                  </Button>
                  <Button className="
                      bg-green-500 hover:bg-green-600 
                      text-white font-semibold cursor-pointer
                      text-sm sm:text-base
                      p-4 sm:p-4 lg:p-4
                      rounded-4xl
                      w-full max-w-[90%] sm:max-w-[400px] lg:max-w-[500px]
                      transition-all duration-300
                    ">
                      Download Zip File
                    </Button>
                  <p className="text-xs text-gray-500 mt-3">
                    *The zip file contains reports of the farms visited by satellite in the last 2 days only
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Detailed Scientific Report</h2>
                <div className="flex items-center gap-2">
                  <input type="date" className="border rounded-md px-2 py-1 text-sm" defaultValue="2025-10-27" />
                  <select className="border rounded-md px-2 py-1 text-sm">
                    <option>Select Language</option>
                  </select>
                  <Button className="bg-teal-600 hover:bg-teal-700">Download</Button>
                </div>
              </div>

              {/* PDF Preview Section (Blank) */}
              <div className="flex justify-center items-center h-[80vh] border rounded-lg bg-gray-100">
                {/* <p className="text-gray-400 italic">PDF Preview (blank)</p> */}
                <iframe
                    src={reportData?.fieldReport?.url || null}
                    width="100%"
                    height="100%"
                    className="border-0"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


