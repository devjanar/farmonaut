"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SearchDropdownProps {
  btn?: boolean; // optional, default true
  items: { Name: string; FieldID: string; OrderDate: string }[];
  placeholder?: string;
  onSubmit: (selected: { Name: string; FieldID: string; OrderDate: string } | null) => void;
  maxWidth?: number; // optional, default 180px
}

export default function MyField({
  btn = true,
  items,
  placeholder = "Search...",
  onSubmit,
  maxWidth = 180,
}: SearchDropdownProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<{ Name: string; FieldID: string; OrderDate: string } | null>(null);

  const filteredItems = items.filter((item) =>
    item.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (item: { Name: string; FieldID: string; OrderDate: string }) => {
    const newSelected =
      selectedItem?.FieldID === item.FieldID ? null : item;
    setSelectedItem(newSelected);
    onSubmit(newSelected); 
  };

  return (
    <div
      className={`w-full flex flex-col gap-2 p-2 bg-white dark:bg-gray-800 rounded-md shadow-md`}
      style={{ maxWidth: `${maxWidth}px` }}
    >
      {/* Search Box */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto max-h-[200px] mt-2">
        <ul className="flex flex-col gap-1">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li
                key={item.FieldID}
                onClick={() => handleSelect(item)}
                className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center ${
                  selectedItem?.FieldID === item.FieldID
                    ? "bg-blue-100 dark:bg-blue-700"
                    : ""
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{item.Name}</span>
                  {/* <span className="text-xs text-gray-500">{item.OrderDate}</span> */}
                </div>
                {selectedItem?.FieldID === item.FieldID && (
                  <span className="text-blue-600 dark:text-white font-bold">✓</span>
                )}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-400">No results</li>
          )}
        </ul>
      </div>
        {/* Submit Button */}
      {btn && (
        <Button
          variant="default"
          className="w-full py-2 mt-2 bg-gray-400 hover:bg-gray-600 cursor-pointer"
          onClick={() => onSubmit(selectedItem)}
        >
          Search By Field
        </Button>
      )}
    </div>
  );
}
