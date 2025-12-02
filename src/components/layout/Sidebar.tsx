"use client";
import Image from "next/image";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { closeHome, openHome } from "@/store/HomeSlice";
import { openFarmAdvisor } from "@/store/FarmAdvisorSlice";
import { openNewField,closeNewField } from "@/store/AddNewFieldSlice";
import { openFarmList } from "@/store/FarmListSlice";
import { toggleMapControl,closeMapControl } from "@/store/MapControlSlice";
import { openFarmIndexResult,closeFarmIndexResult } from "@/store/FarmIndexResultSlice";
import { openReport,closeReport } from "@/store/ReportSlice";
import { openWeather,closeWeather } from "@/store/WeatherSlice";
// React Icons imports
import { BiBarChart, BiSolidReport } from "react-icons/bi";
import { PiListChecks } from "react-icons/pi";
import { TbPointer } from "react-icons/tb";
import { IoAddOutline, IoMap } from "react-icons/io5";
import { TiWeatherPartlySunny } from "react-icons/ti";

export default function Sidebar() {
  const dispatch = useDispatch();
  const [open, setSidebarOpen] = useState(true);

  return (
    <div
      className={`${
        open ? "w-64" : "w-20"
      } transition-all duration-300 bg-green-200 dark:bg-gray-800 py-[25px] 
      px-2 h-full flex flex-col border-r border-green-200`}
    >
      {/* Logo */}
      <div className={`${
        open ? "justify-left":"justify-center"
      } flex items-center mb-6`}>
        <Image
          src="/innovationghar.png"
          width={48}
          height={48}
          alt="Logo"
          className="rounded-full"
        />
        {open && (
          <span className="ml-3 text-[24px] font-bold text-gray-900 dark:text-white capitalize">
            IG
          </span>
        )}
      </div>

      <nav className="flex-1 mt-2">
        {/* Top buttons */}
        <div className="flex flex-col mb-8">
          <Button
            variant="outline"
            className={`${
              open ? "justify-between px-3" : "justify-center px-3"
            } rounded-[50px] py-[25px] text-[16px] mb-[15px] flex items-center cursor-pointer bg-white border border-gray-300`}
            onClick={() => {
                console.log("New Field clicked");
                dispatch(closeHome());
                dispatch(closeFarmIndexResult());
                dispatch(closeReport())
                dispatch(closeWeather())
                dispatch(openNewField());
              }}
          >
            {/* Left icon */}
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
              <IoAddOutline className="w-5 h-5" />
            </span>
            {open && <span className="flex-1 text-center">Add a New Field</span>}
          </Button>

          <Button
            variant="outline"
            className={`${
              open ? "justify-between px-3" : "justify-center px-3"
            } rounded-[50px] py-[25px] text-[16px] flex items-center cursor-pointer bg-white border border-gray-300`}
              onClick={() => {
                console.log("Farm Advisory clicked");
                dispatch(openFarmAdvisor());
              }}
          >
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
              <TbPointer className="w-5 h-5" />
            </span>
            {open && <span className="flex-1 text-center">Farm Advisory</span>}
          </Button>
        </div>

        {/* Menu buttons */}
        <div className="flex flex-col mb-8">
          <Button
            variant="ghost"
            className={`${
              open ? "justify-start px-5" : "justify-center"
            } rounded-[10px] py-[25px] text-[16px] mb-[15px] flex items-center gap-3 cursor-pointer`}
            onClick={() => { 
              console.log("All Farms clicked");
              dispatch(openFarmList());
              }}
          >
            <PiListChecks className="text-[22px]" />
            {open && <span>All Farms</span>}
          </Button>

          <Button
            variant="ghost"
            className={`${
              open ? "justify-start px-5" : "justify-center"
            } rounded-[10px] py-[25px] text-[16px] mb-[15px] flex items-center gap-3 cursor-pointer`}
            onClick={()=>{
                setSidebarOpen(!open)
                dispatch(openHome());
                dispatch(closeReport())
                dispatch(closeFarmIndexResult());
                dispatch(closeWeather())
                dispatch(toggleMapControl())        
            }}
          >
            <IoMap className="text-[22px]" />
            {open && <span>Map Control</span>}
          </Button>

          <Button
            variant="ghost"
            className={`${
              open ? "justify-start px-5" : "justify-center"
            } rounded-[10px] py-[25px] text-[16px] mb-[15px] flex items-center gap-3 cursor-pointer`}
            onClick={()=>{
              console.log("Index Results clicked");
              setSidebarOpen(true)
              dispatch(closeHome());
              dispatch(closeMapControl());
              dispatch(closeNewField())
              dispatch(closeReport())
              dispatch(closeWeather())
              dispatch(openFarmIndexResult());
            }}
          >
            <BiBarChart className="text-[22px]" />
            {open && <span>Index Results</span>}
          </Button>

          <Button
            variant="ghost"
            className={`${
              open ? "justify-start px-5" : "justify-center"
            } rounded-[10px] py-[25px] text-[16px] mb-[15px] flex items-center gap-3 cursor-pointer`}
            onClick={()=>{
              console.log("Index Results clicked");
              setSidebarOpen(true)
              dispatch(closeHome());
              dispatch(closeMapControl());
              dispatch(closeNewField())
              dispatch(closeFarmIndexResult());
              dispatch(closeWeather())
              dispatch(openReport())
            }}
          >
            <BiSolidReport className="text-[22px]" />
            {open && <span>Reports</span>}
          </Button>

          <Button
            variant="ghost"
            className={`${
              open ? "justify-start px-5" : "justify-center"
            } rounded-[10px] py-[25px] text-[16px] mb-[15px] flex items-center gap-3 cursor-pointer`}
             onClick={()=>{
              console.log("Index Results clicked");
              setSidebarOpen(true)
              dispatch(closeHome());
              dispatch(closeMapControl());
              dispatch(closeNewField())
              dispatch(closeReport())
              dispatch(closeFarmIndexResult());
              dispatch(openWeather())
            }}
          >
            <TiWeatherPartlySunny className="text-[22px]" />
            {open && <span>Weather</span>}
          </Button>
        </div>
      </nav>
    </div>
  );
}
