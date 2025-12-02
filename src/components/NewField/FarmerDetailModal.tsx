"use client";
import {API} from "@/apiEnv"
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openHomeWithData,openHome } from "@/store/HomeSlice";
import { openNewField,closeNewField } from "@/store/AddNewFieldSlice";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calender } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchableCropSelect from "@/components/SearchableCropSelect";


interface FarmerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: {
    crop: { name: string; code: string } | null;
    fieldName: string;
    sowingDate: Date | null;
  }) => void;
  selectedCoords?: [number, number][] | null;
}

export default function FarmerDetailModal({
  isOpen,
  onClose,
  selectedCoords,
}: FarmerDetailModalProps) {
  const dispatch = useDispatch();
  const [selectedCrop, setSelectedCrop] = useState<{ name: string; code: string } | null>(null);
  const [fieldName, setFieldName] = useState("");
  const [sowingDate, setSowingDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);


  const handleSave = async () => {
    if (!selectedCrop || !fieldName || !selectedCoords || selectedCoords.length < 3) {
      console.warn("Please select crop, field name, and at least 3 coordinates");
      return;
    }

    const formData = {
      crop: selectedCrop,
      fieldName,
      sowingDate,
      selectedCoords
    };
    console.log(`${API}/field/createField`)
    setLoading(true);
    try {
      const res = await fetch(`${API}/field/createField`, {
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

      const { data, message } = dataValue;
      if (data && data.FieldID) {
        onClose();
        dispatch(openHomeWithData({ id: data.FieldID }));
        setTimeout(() => {
          dispatch(closeNewField());
          dispatch(openHome());
        }, 10000);
      } else {
        alert(message || "Failed to create field");
      }

    } catch (error: any) {
      dispatch(openNewField());
      console.error("Error submitting field:", error);
      alert(error.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        hideClose
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="w-[50vw] h-[60vh] !max-w-none !max-h-none flex flex-col justify-between 
        bg-[#ccc] dark:bg-gray-800 rounded-md p-10"
      >
        {/* Header hidden */}
        <DialogHeader className="hidden">
          <DialogTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100" />
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-auto bg-white dark:bg-gray-900 rounded-md p-6 
        text-gray-700 dark:text-gray-200">
          <h3 className="text-2xl font-semibold mb-6 text-center">Farmer Details</h3>

          {/* Row 1: Crop Name */}
          <div className="flex items-center mb-4 gap-4">
            <Label htmlFor="cropName" className="w-[30%] text-right">
              Crop Name:
            </Label>
            <div className="flex-1">
              <SearchableCropSelect
                value={selectedCrop?.code}
                onChange={(crop) => setSelectedCrop(crop)}
              />
            </div>
          </div>

          {/* Row 2: Field Name */}
          <div className="flex items-center mb-4 gap-4">
            <Label htmlFor="fieldName" className="w-[30%] text-right">
              Field Name:
            </Label>
                <Input
              id="fieldName"
              type="text"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              className="flex-1"
              placeholder="Enter field name"
            />
          </div>

          {/* Row 3: Sowing Date */}
          <div className="flex items-center mb-4 gap-4">
            <Label htmlFor="sowingDate" className="w-[30%] text-right">
              Sowing / Season Start Date:
            </Label>
            <div className="flex-1">
              <Calender
                 value={sowingDate || new Date()}
                 onClick={(date) => {
                  if (date instanceof Date) setSowingDate(date);
                }}
                CalenderIcon="right"
                ChevronIcon={false}
                dateFormat={"DD/MM/YYYY"}
                btnClassName="w-full justify-between rounded py-[10px]"
              />
            </div>
          </div>

          {/* Selected Info */}
          {selectedCrop && (
            <p className="text-center text-gray-600 mt-4">
              Selected: <strong>{selectedCrop.name}</strong> (Code: {selectedCrop.code})
            </p>
          )}
        </div>

        {/* Footer inside DialogContent */}
        <DialogFooter className="flex justify-end mt-4 gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            type="submit"
            className="min-w-[160px] rounded-full text-lg font-semibold bg-gray-500 
            hover:bg-gray-700 text-white transition-colors"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
