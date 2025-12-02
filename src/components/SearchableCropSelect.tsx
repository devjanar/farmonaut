"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import crops from "@/data/cropCodes.json"; // adjust path if needed

export default function SearchableCropSelect({
  value,
  onChange,
}: {
  value?: string;
  onChange: (crop: { name: string; code: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Convert object to array
  const cropList = Object.entries(crops).map(([name, code]) => ({ name, code }));

  // Filter crops based on search input
  const filtered = cropList.filter((crop) =>
    crop.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCrop = cropList.find((crop) => crop.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal",
            !selectedCrop && "text-muted-foreground"
          )}
        >
          {selectedCrop ? selectedCrop.name : "Select Crop"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-2">
        <Input
          placeholder="Search crop..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />
        <ScrollArea className="h-[250px]">
          {filtered.length > 0 ? (
            <div className="space-y-1">
              {filtered.map((crop) => (
                <div
                  key={crop.code}
                  onClick={() => {
                    onChange(crop);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "cursor-pointer rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800",
                    value === crop.code && "bg-gray-200 dark:bg-gray-700 font-medium"
                  )}
                >
                  {crop.name}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm py-4">
              No results found.
            </p>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
