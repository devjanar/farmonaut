"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { closeSearchModal } from "@/store/SearchSlice";
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


export default function SearchModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.search.isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(closeSearchModal())}>
      <DialogContent
        hideClose
         onInteractOutside={(e) => e.preventDefault()}
         onEscapeKeyDown={(e) => e.preventDefault()}
        className="w-[40vw] h-[30vh] !max-w-none !max-h-none flex flex-col 
        justify-between bg-[#fff] dark:bg-gray-400 rounded-md p-10"
      >

        {/* Body/content area */}
        <div className="grid w-full items-center gap-3">
          <Label className="text-[30px]" htmlFor="name">Enter Email/Phone</Label>
          <Input type="text" id="name" className="p-[15px] h-[50px] w-full" placeholder="Enter" />
        </div>

        <DialogFooter>
          <div className="flex w-full justify-center items-center gap-4">
            <Button className="p-[20px] w-[100px] rounded-[4px] text-white bg-green-400 hover:bg-green-600" 
            onClick={() => dispatch(closeSearchModal())}
            >
              Sumit
            </Button>
            <Button variant="outline" className="p-[20px] w-[100px] rounded-[4px] text-white bg-gray-400 hover:bg-gray-600" 
            onClick={() => dispatch(closeSearchModal())}
            >
              Cancel
            </Button>
          </div>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}