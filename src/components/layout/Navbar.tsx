"use client";
import {API} from "@/apiEnv"
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { openHomeWithData } from "@/store/HomeSlice";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { openProfileModal } from "@/store/ProfileSlice";
import { openVideoModal } from "@/store/VideoSlice";
import { openSearchModal } from "@/store/SearchSlice";
import { toggleMyField } from "@/store/MyFieldSlice";
import { openHome } from "@/store/HomeSlice";
import { closeNewField } from "@/store/AddNewFieldSlice";
import MyField from "@/components/MyField";
import { HiOutlineHome, HiOutlineMenu, HiOutlineSearch } from "react-icons/hi";
import { AiFillHome } from "react-icons/ai";
import { IoChevronDown, IoLogoYoutube, IoCaretDown, IoLocationSharp } from "react-icons/io5";
import TranslateSelect from "./TranslateSelect"

interface NavbarProps {
  userInfo?: any; 
}

export default function Navbar({userInfo}:NavbarProps) {

  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.myfield.isOpen);
  const [state, setState] = useState<any[]>([]);

  const fetchField = async () => {
    try {
      setState([]); // Clear existing data before loading

      const res = await fetch(`${API}/field/syncFieldsFarmonaut`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch fields: ${res.status} ${res.statusText}`);
      }

      const dataValue = await res.json();
      console.log("Fetched:", dataValue);

      if (dataValue?.data?.length) {
        setState(dataValue.data);
      } else {
        console.warn("No fields found from API");
        setState([]); // Keep it empty if no data
      }

    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    let ignore = false;
    const fetchData = async () => {
      const dataValue = await fetchField();
      if (ignore) return;
    };
    fetchData();
    return () => {
      ignore = true;
    };
  }, [isOpen]);


  return (

    <>
    <header className="flex items-center justify-between 
    bg-white dark:bg-gray-800 py-[5px] px-4 border-b border-gray-100"
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-2">

        {/* Home Button */}
        <Button
          variant="outline"
          className="min-w-[200px] rounded-[50px] p-[25px] text-[18px] flex items-center gap-2 justify-center cursor-pointer"
            onClick={() => {
              dispatch(closeNewField());
              dispatch(openHome());
            }}
        >
          <AiFillHome className="w-5 h-5" />
          <span>Home</span>
        </Button>

        {/* My Fields Button opens modal via Redux */}
        <div className="min-w-[200px] rounded-[50px] 
          py-[25px] px-0 text-[18px] flex items-center justify-between relative"
        >
          <Button
            variant="outline"
            className="min-w-[200px] rounded-[50px] py-[25px] px-0 text-[18px] flex items-center justify-between cursor-pointer"
              onClick={() => {
              dispatch(toggleMyField());
            }}
          >
            <IoLocationSharp className="w-5 h-5 ml-3" />
            <span className="flex-1 text-center">My Fields</span>
            <IoChevronDown className="w-5 h-5 mr-3" />
          </Button>
          {/* MyField Component */}
          {
            isOpen &&
            <div className="absolute top-full left-0 z-50 border border-gray-300 rounded-md -mt-2">
              <MyField
                items={state}
                placeholder="Search fields..."
                maxWidth={200} // optional
                onSubmit={(selectedItems) => {
                  dispatch(toggleMyField());
                  console.log("Selected items:", selectedItems);
                  dispatch(openHomeWithData({ id: selectedItems?.FieldID }));
                }}
              />
            </div>
          }
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-2">
        <TranslateSelect/>
        {/* Search Button */}
        <Button variant="ghost" size="icon" className="min-w-[70px] cursor-pointer"
        onClick={() => dispatch(openSearchModal())} // Redux opens modal
        >
          <HiOutlineSearch className="text-[28px]" />
        </Button>

        {/* YouTube Button */}
        <Button variant="ghost" size="icon" className="min-w-[70px] text-[18px] cursor-pointer"
        onClick={() => dispatch(openVideoModal())} // Redux opens modal
        >
          <IoLogoYoutube className="w-5 h-5" />
        </Button>

        {/* User Button */}
        <Button
          variant="outline"
          className="min-w-[200px] rounded-[50px] py-[25px] px-0 text-[16px] flex items-center justify-between cursor-pointer"
          onClick={() => dispatch(openProfileModal())} // Redux opens modal
        >
          <Image
            src="/innovationghar.png"
            width={40}
            height={40}
            alt="Logo"
            className="rounded-full"
          />
          <span className="flex-1 text-center max-w-[80px] truncate">
            {userInfo?.user?._name}
          </span>
          <IoCaretDown className="w-5 h-5 mr-3" />
        </Button>
      </div>
    </header>
    </>
  );
}
