"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { closeVideoModal } from "@/store/VideoSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/_dialog";
import { Button } from "@/components/ui/button";

export default function VideoModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.video.isOpen);

  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(closeVideoModal())}>
      <DialogContent
        className="w-[80vw] h-[80vh] !max-w-none !max-h-none
        flex flex-col justify-between items-stretch
        bg-white dark:bg-gray-800
        rounded-none"
      >
        <DialogHeader>
          <DialogTitle>My Fields</DialogTitle>
          <DialogDescription>
            This modal is now controlled by Redux Toolkit.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => dispatch(closeVideoModal())}>
            Cancel
          </Button>
          <Button onClick={() => dispatch(closeVideoModal())}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}