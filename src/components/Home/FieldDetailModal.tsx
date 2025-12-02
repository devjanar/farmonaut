// src/components/modals/ProfileModal.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { closeFieldDetail } from "@/store/FieldDetailSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import SelectCrop from "@/components/SelectCrop";
import { Calender } from "@/components/common";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { IoCloseOutline } from "react-icons/io5";


interface FieldDetailProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: {
    crop: { name: string; code: string } | null;
    fieldName: string;
    sowingDate: Date | null;
  }) => void;
  data?: any | null;
}

export default function FieldDetailModal({
  isOpen,
  onClose,
  data,
}: FieldDetailProps) {
  const [state, setState] = useState<any>(data || {});
  // const dispatch = useDispatch();
  // const isOpen = useSelector((s: RootState) => s.fielddetail.isOpen);
console.log("Field Detail Data:", data.CropCode);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        hideClose
         onInteractOutside={(e) => e.preventDefault()}
         onEscapeKeyDown={(e) => e.preventDefault()}
        className="w-[65vw] h-[80vh] !max-w-none !max-h-none flex flex-col 
        justify-between bg-[#ccc] dark:bg-gray-800 rounded-md p-10"
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between w-full gap-4x mb-4">
                <div className="w-8/12 flex flex-col justify-start items-left">
                <h2 className="mb-0 text-[40px] block">Field Details</h2>
              </div>
              <div className="w-3/12 flex justify-end items-center">
                <Button
                  onClick={() => onClose()}
                  className="p-0 ml-2 w-[40px] h-[40px] rounded-full flex items-center justify-center 
                  text-4xl font-bold bg-gray-400 hover:bg-gray-600 
                  transition-colors cursor-pointer"
                  aria-label="Close"
                  >
                  <IoCloseOutline className="w-[30px] h-[30px] text-white" />
                </Button>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Body/content area */}
        <div className="flex-1 overflow-auto">
          <div className="w-flex flex flex-col bg-white rounded-md pb-4 mb-4
          text-gray-700 dark:text-gray-200"
           >

            {/* Row 1 */}
            <div className="flex flex-col md:flex-row w-full px-4 mt-8">
              <h3 className="mb-2 font-semibold">Field Info</h3>
            </div>
            {/* Row 1.2 */}
            <div className="flex flex-col md:flex-row w-full">
              {/* Left column */}
              <div className="flex-1 flex flex-col items-start px-4 ">
                <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor="name">Field Info</Label>
                  <Input type="text" id="name" value={state.FieldID || ""} placeholder="" disabled/>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center px-4 ">
                <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor="pdescriptionhone">Field Discription :</Label>
                  <Input type="text" id="description" value={state.FieldDescription || ""} placeholder="Enter" />
                </div>
              </div>
                <div className="flex-1 flex flex-col items-center px-4 ">
                <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor="phone">Crop Name :</Label>
                  <div className="flex-1">
                    <SelectCrop
                      value={state?.CropCode}
                      onChange={(v) => {
                        setState((prev: any) => ({ ...prev, CropCode: v.code }));
                       }}
                    />
                  </div>
                </div>
              </div>
              {/* Right column */}
              <div className="flex-1 flex flex-col items-end px-4 ">
                <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor="email">Sowing /Season Start Date: </Label>
                  <Calender
                  value={state.OrderDate || new Date()}
                  onClick={() => {
                    console.log("Date clicked");
                  }} 
                  CalenderIcon="right"
                  ChevronIcon={false}
                  dateFormat={"DD/MM/YYYY"}
                  btnClassName={'w-full justify-between rounded py-[10px]'}/>
                </div>
              </div>
            </div>

           <Separator className="my-4 !w-[95%] mx-auto" />

            {/* Row 2 */}
            <div className="flex flex-col md:flex-row w-full px-4">
              <h3 className="mb-2 font-semibold">Personal Info</h3>
            </div>
            {/* Row 2.1 */}
            <div className="flex flex-col md:flex-row w-full">
              {/* Left column */}
              <div className="flex-1 flex flex-col items-start px-4">
                <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor="name">Farmer Name</Label>
                  <Input type="text" id="name" value={state.Name || ""} placeholder="Enter" />
                </div>
              </div>
              <div className="flex-1 flex flex-col items-end px-4">
                <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor="phone">Farmer Phone</Label>
                  <Input type="text" id="phone" value={state.phone || ""} placeholder="Enter" />
                </div>
              </div>
            </div>

            <Separator className="my-10 !w-[95%] mx-auto" />

            {/* Row 3 */}
            <div className="flex flex-col md:flex-row w-full px-4">
              <h3 className="mb-2 font-semibold">Report Language</h3>
            </div>
            {/* Row 3.1 */}
            <div className="flex flex-col md:flex-row w-full">
              {/* Left column */}
              <div className="flex-1 flex flex-col items-start px-4 ">
                  <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bangla">RVI</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                  </SelectContent>
                </Select>              
              </div>
              <div className="flex-1 flex flex-col items-end px-4 ">
                <Button
                  className="min-w-[180px] rounded-full flex items-center justify-center 
                  text-1xl font-bold bg-gray-400 hover:bg-gray-600 
                  transition-colors cursor-pointer"
                  aria-label="Close"
                  >
                  Submit Report Language
                </Button>
              </div>
            </div>
          </div>
          <Button
            className="min-w-[180px] rounded-full flex items-center justify-center 
            text-1xl font-bold bg-gray-400 hover:bg-gray-600 
            transition-colors cursor-pointer"
            aria-label="Close"
            >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
