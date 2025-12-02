// src/components/modals/FarmListModal.tsx
"use client";
import {API} from "@/apiEnv"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { openHomeWithData } from "@/store/HomeSlice";
import { closeFarmList } from "@/store/FarmListSlice";
import { closeFarmIndexResult } from "@/store/FarmIndexResultSlice";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { convertToHectares,convertToAcres } from "@/service";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Hourglass } from "lucide-react";
import { 
  IoCloseOutline,IoBusiness,
  IoPauseOutline,IoCheckmarkCircleSharp,IoSquareSharp,IoWarningOutline
 } from "react-icons/io5";
import { Loader } from "@/components/element";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import CustomSelect from "@/components/ui/CustomSelect";


type Farm = {
  Name: string;
  FieldID: string;
  FieldDescription: string;
  FieldArea: number;
  expiry: string;
  OrderDate: string;
  status: "all" | "delete" | "Paused";
};


export default function FarmListModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((s: RootState) => s.farmlist.isOpen);

  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  //
  const fetchFarms = async (status: string = "all") => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/field/sync-farmonaut`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }), // send filter if needed
      });
      const dataValue = await res.json();
      // console.log("Fetched:", dataValue);
      setFarms(dataValue.data || []);
    } catch (error) {
      console.error("Error fetching fields:", error);
    } finally {
      setLoading(false);
    }
  };
  //
  useEffect(() => {
    if (!isOpen) return;
    let ignore = false;
    const fetchData = async () => {
      await fetchFarms(filter);
    };
    fetchData();
    return () => {
      ignore = true; // prevent state updates after unmount
    };
  }, [isOpen, filter]);
  //
  const handleFilterChange = (value: string) => {
    setFilter(value);
    fetchFarms(value);
  };

  const totalArea: number = farms.reduce((sum: number, f: Farm) => sum + convertToHectares(f.FieldArea), 0);

  const downloadExcel = (farms: Farm[]) => {
  if (!farms.length) return;

  // Map farms to a "formatted" object for Excel
  const data = farms.map((f, i) => ({
    "S. No.": i + 1,
    "Farm ID": f.FieldID || "",
    "Farmer Name": f.Name || "",
    "Description": f.FieldDescription || "",
    "Total Area (Hectares)": convertToHectares(f.FieldArea || 0),
    "Subscription Expiry": f.expiry || "",
    "Order Date": f.OrderDate || "",
  }));

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data, { skipHeader: false });

  // Optional: Set column widths
  const wsCols = [
    { wpx: 50 }, // S. No.
    { wpx: 150 }, // Farm ID
    { wpx: 200 }, // Farmer Name
    { wpx: 250 }, // Description
    { wpx: 120 }, // Total Area
    { wpx: 150 }, // Subscription Expiry
    { wpx: 150 }, // Order Date
  ];
  ws["!cols"] = wsCols;

  // Create workbook and add worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Farms");

  // Write workbook and trigger download
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `Farms_${new Date().toISOString().split("T")[0]}.xlsx`);
};

const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

if (!mounted) return null;


  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) dispatch(closeFarmList()); }}>
       <DialogContent
        hideClose
        className="w-[95vw] h-[85vh] !max-w-none !max-h-none flex flex-col bg-white dark:bg-gray-900 rounded-xl p-6"
      >
        <DialogHeader>
          <DialogTitle>
            <VisuallyHidden>Farm List Modal</VisuallyHidden>
          </DialogTitle>
        </DialogHeader>

        {/* Close Button */}
        <Button
          onClick={() => dispatch(closeFarmList())}
          className="absolute top-4 right-4 p-2 rounded-full cursor-pointer
          bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          aria-label="Close"
        >
          <IoCloseOutline className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </Button>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? 
            <Loader/>
            :
            <>
            {/* Top controls */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 w-full">
                 <Input
                    placeholder="Search Farm using FieldId/Name"
                    className="flex-1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                {/* <Select
                  onValueChange={handleFilterChange}
                  value={filter}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                  </SelectContent>
                </Select> */}
                <CustomSelect
                  value={filter}
                  onChange={handleFilterChange}
                  placeholder="All"
                  options={[
                    { value: "all", label: "All" },
                    { value: "delete", label: "Delete" },
                  ]}
                  className="w-[120px]"
                />

              </div>
              <div className="flex items-center gap-2 w-ful">
                <Button className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer" onClick={()=>{
                  downloadExcel(farms)
                }}>
                  <Download className="mr-2 h-4 w-4" />
                  Download All
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-center p-4">
                <p className="flex items-center justify-center text-lg text-muted-foreground">
                  <IoBusiness/>
                  Total Farms
                </p>
                <p className="text-xl font-semibold">{farms.length} / {farms.length}</p>
              </div>
              <div className="text-center p-4">
                <p className="flex items-center justify-center text-lg text-muted-foreground">
                  <IoSquareSharp/>
                  Total Area
                </p>
                <p className="text-xl font-semibold">{totalArea.toFixed(2)} <span className="text-sm">Hectares</span></p>
              </div>
              <div className="text-center p-4">
                <p className="flex items-center justify-center text-lg text-muted-foreground">
                  <IoCheckmarkCircleSharp/>
                  Active Farms
                </p>
                <p className="text-xl font-semibold">{farms.filter(f => f.status === "all").length}</p>
              </div>
              <div className="text-center p-4">
              <p className="flex items-center justify-center text-lg text-muted-foreground">
                  <IoPauseOutline/>
                  Paused Farms
                  </p>
                <p className="text-xl font-semibold">{farms.filter(f => f.status === "Paused").length}</p>
              </div>
              <div className="text-center p-4">
                <p className="flex items-center justify-center text-lg text-muted-foreground">
                  <IoWarningOutline/>
                  Expired Farms
                </p>
                <p className="text-xl font-semibold">{farms.filter(f => f.status === "delete").length}</p>
              </div>
            </div>

            {/* Table */}
            <div className="mt-8 rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-100 dark:bg-gray-800">
                  <TableRow>
                    <TableHead className="text-center">S. No.</TableHead>
                    <TableHead className="text-center">Farm Id</TableHead>
                    <TableHead>User Name / Description</TableHead>
                    <TableHead className="text-center">
                        Total Area
                        <span className="block">(in Hectares)</span>
                    </TableHead>
                    <TableHead className="text-center">
                      Subscription Expiry
                      <span className="block">(Months/Subscription Expiry Date)</span>
                    </TableHead>
                    <TableHead className="text-center">Farm Added On</TableHead>
                    <TableHead className="text-center">Remark</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {farms.length > 0
                    ? farms
                        .filter(
                          (f) =>
                              (f.FieldDescription ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (f.FieldID ?? "").toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((farm, i) => (
                          <TableRow key={farm.FieldID} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <TableCell className="text-center">{i + 1}</TableCell>
                            <TableCell>
                              <Input
                                value={farm.FieldID}
                                readOnly
                                className="w-[160px] text-sm cursor-pointer"
                                onClick={() => {
                                  dispatch(closeFarmList())
                                  dispatch(closeFarmIndexResult());
                                  dispatch(openHomeWithData({ id: farm.FieldID }));
                                }}
                              />
                            </TableCell>
                            <TableCell className="max-w-xs">{farm.FieldDescription}, {farm.Name}</TableCell>
                            <TableCell className="text-center">{convertToHectares(farm.FieldArea)}</TableCell>
                            <TableCell className="text-center">{farm.expiry}</TableCell>
                            <TableCell className="text-center">{farm.OrderDate}</TableCell>
                            <TableCell className="text-center">
                              {farm.status === "all" && (
                                <Badge className="bg-emerald-600 hover:bg-emerald-700">Active</Badge>
                              )}
                              {farm.status === "delete" && (
                                <Badge className="bg-red-500 hover:bg-red-600">Delete</Badge>
                              )}
                              
                              <Checkbox id={`farm-${i}`} className="ml-3" />
                            </TableCell>
                          </TableRow>
                        ))
                    : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                          No farms found
                        </TableCell>
                      </TableRow>
                    )}
                </TableBody>
              </Table>
            </div>
            </>
          }
        </div>
      </DialogContent>
    </Dialog>
  );
}
