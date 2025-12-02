"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import crops from "@/data/cropCodes.json"; // adjust path if needed

export default function SelectCrop({
  value,
  onChange,
}: {
  value?: string;
  onChange: (crop: { name: string; code: string }) => void;
}) {
  // Convert object to array
  const cropList = Object.entries(crops).map(([name, code]) => ({ name, code }));

  const selectedCrop = cropList.find((crop) => crop.code === value);

  return (
    <Select
      value={value}
      onValueChange={(code) => {
        const crop = cropList.find((c) => c.code === code);
        if (crop) onChange(crop);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Crop" />
      </SelectTrigger>

      <SelectContent className="max-h-60 overflow-y-auto">
        {cropList.map((crop) => (
          <SelectItem key={crop.code} value={crop.code}>
            {crop.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
