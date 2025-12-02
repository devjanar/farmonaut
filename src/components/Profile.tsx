// src/components/modals/ProfileModal.tsx
"use client";
import { API } from "@/apiEnv"; 
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { closeProfileModal } from "@/store/ProfileSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { IoCloseOutline } from "react-icons/io5";
import { FaUserEdit } from "react-icons/fa";

interface ProfileProps {
  userInfo?: {
    user?: any; // or give a proper type
  };
}

export default function ProfileModal({userInfo}:ProfileProps) {
  const dispatch = useDispatch();
  const isOpen = useSelector((s: RootState) => s.profile.isOpen);
  const [state, setState] = useState<any>(userInfo?.user || null);

  useEffect(() => {
    setState(userInfo?.user || null);
}, [userInfo]);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API}/auth/signout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        console.error(data.error || "Logout failed");
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) dispatch(closeProfileModal()); }}>
      <DialogContent
        hideClose
         onInteractOutside={(e) => e.preventDefault()}
         onEscapeKeyDown={(e) => e.preventDefault()}
        className="w-[80vw] h-[80vh] !max-w-none !max-h-none flex flex-col 
        justify-between bg-[#ccc] dark:bg-gray-800 rounded-md p-10"
      >
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between w-full gap-4x mb-4">
              <div className="w-1/12 flex justify-start items-center">
                <FaUserEdit className="text-[66px] text-gray-700 dark:text-gray-200" />
              </div>
                <div className="w-8/12 flex flex-col justify-start items-left">
                <h2 className="mb-0 text-[30px] block">My Profile</h2>
                <div className="flex gap-4">
                  <Link href="/my-field" className="text-gray-500 hover:underline">
                    Privacy Policy
                  </Link>
                  <Link href="/my-field" className="text-gray-500 hover:underline">
                    Customer Terms of Service
                  </Link>
                </div>
              </div>
              <div className="w-3/12 flex justify-end items-center">
                <Button
                  onClick={() => dispatch(closeProfileModal())}
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
            <div className="flex flex-col md:flex-row w-full">
              {/* Left column */}
              <div className="flex-1 flex flex-col items-start p-4 ">
                <h3 className="mb-2 font-semibold">Personal Info</h3>
              </div>
              {/* Right column */}
              <div className="flex-1 flex flex-col items-end p-4 ">
                <Button
                className="rounded-full flex items-center justify-center 
                text-1xl font-bold bg-gray-400 hover:bg-gray-600 
                transition-colors cursor-pointer"
                aria-label="Close"
                >
                  Reset Password
                </Button>
              </div>
            </div>
            {/* Row 2 */}
            <div className="flex flex-col md:flex-row w-full">
              {/* Left column */}
              <div className="flex-1 flex flex-col items-start p-4 ">
                <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor="name">Farmer Name</Label>
                  <Input type="text" id="name" placeholder="Enter" value={state._name} onChange={(e)=>setState({...state,_name:e.target.value})}/>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center p-4 ">
                <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor="phone">Farmer Phone</Label>
                  <Input type="text" id="phone" placeholder="Enter" value={state._phone}  onChange={(e)=>setState({...state,_phone:e.target.value})}/>
                </div>
              </div>
              {/* Right column */}
              <div className="flex-1 flex flex-col items-end p-4 ">
                <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor="email">Farmer Email</Label>
                  <Input type="email" id="email" placeholder="Enter" value={state._email} disabled/>
                </div>
              </div>
            </div>
          </div>
          <div className="w-flex flex flex-col bg-white rounded-md pb-4 mb-4
          text-gray-700 dark:text-gray-200"
           >
            {/* Row 1 */}
            <div className="flex flex-col md:flex-row w-full">
              {/* Left column */}
              <div className="flex-1 flex flex-col items-start p-4 ">
                <div className="flex w-full max-w-sm items-center gap-2">
                  <span className="whitespace-nowrap">Subscription Details</span>
                  <Input
                    value={"Mini Monthly"}
                    className="flex-1 p-[20px] !text-gray-700 dark:!text-gray-200 !text-[20px]"
                    type="text"
                    placeholder="Mini Monthly"
                  />
                </div>
              </div>
              {/* Right column */}
              <div className="flex-1 flex flex-col items-end p-4 ">
                <div className="flex w-full max-w-sm items-center gap-2">
                  <Button
                    className="rounded-full flex items-center justify-center 
                    text-1xl font-bold bg-gray-400 hover:bg-gray-600 
                    transition-colors cursor-pointer"
                    aria-label="Close"
                    >
                    Download Invoice
                  </Button>
                  <Button
                    className="rounded-full flex items-center justify-center 
                    text-1xl font-bold bg-gray-400 hover:bg-gray-600 
                    transition-colors cursor-pointer"
                    aria-label="Close"
                    >
                    Manage Subscription
                  </Button>
                </div>
              </div>
            </div>
            {/* Row 2 */}
            <div className="flex flex-col md:flex-row w-full">
              {/* Left column */}
              <div className="flex-1 flex flex-col items-start p-4 ">
                <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor="name">Active Fields:</Label>
                  <Input type="text" id="name" placeholder="Enter" />
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center p-4 ">
                <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor="phone">Active Field Area:</Label>
                  <Input type="text" id="phone" placeholder="Enter" />
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center p-4 ">
                <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor="phone">Total Quota Used:</Label>
                  <Input type="text" id="phone" placeholder="Enter" />
                </div>
              </div>
              {/* Right column */}
              <div className="flex-1 flex flex-col items-end p-4 ">
                <div className="grid w-full max-w-sm items-center gap-3">
                  <Label htmlFor="email">Subscription Renew Date:</Label>
                  <Input type="email" id="email" placeholder="Enter" />
                </div>
              </div>
            </div>
          </div>
          <Button
            className="rounded-full flex items-center justify-center 
            text-1xl font-bold bg-gray-400 hover:bg-gray-600 
            transition-colors cursor-pointer"
            aria-label="Close"
            onClick={handleLogout}
            >
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
