// src/components/MapControl.tsx
"use client"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux";
import { openMapControlWithData } from "@/store/MapControlSlice";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Download } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Calender } from "@/components/common";
import {imageTypes} from '@/constValue';


export default function MapControl() {
  const dispatch = useDispatch();
  const [state, setState] = useState<any>()
  const [opacity, setOpacity] = useState([66])
  const [latlon, setLatlon] = useState<any>()
  const [timelapseSpeed, setTimelapseSpeed] = useState(0.8)


  useEffect(() => {
    if (state) {
      dispatch(openMapControlWithData(state));
    }
  }, [state]);

  return (
    <div className="w-75 bg-green-950 text-white p-4 space-y-6 rounded overflow-y-auto max-h-screen">
      <div className="flex justify-center">
        <h3>Map Control</h3>
      </div>

      <div className="bg-green-900 text-white p-4 space-y-6 rounded-lg">  
        {/* Download KML */}
        <div>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-transparent cursor-pointer text-white"
          >
            <Download size={16} /> Download KML File
          </Button>
          
        </div>
        <Separator className="mt-0 mb-6 border border-gray-400" />

        {/* Show Coordinates */}
        <div className="space-y-2">
          <Label>Show Coordinates</Label>
          <Input
            placeholder="Example: 25.7647,86.6180"
            value={latlon}
            onChange={(e) => {
              const value = e.target.value;
              setLatlon(value);
              // Convert string to [lat, lon] array
              const parts = value.split(",").map((v) => parseFloat(v.trim()));
              // Only update if both numbers are valid
              if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                setState({ ...state, latlon: parts });
              }
            }}
          />
          <Button className="w-full rounded-[50px] bg-green-500 hover:bg-green-600 cursor-pointer">Show On Map</Button>
        </div>
        <Separator className="my-5 border border-gray-400" />

        {/* Set Opacity */}
        <h4 className="m-[0px]">Set Opacity</h4>
        <div className="bg-green-800 p-3 rounded-lg flex space-y-2 gap-4 items-center justify-center">
          <Slider
            className="flex-1 m-[0px] cursor-pointer"
            value={opacity}
            min={0}
            max={100}
            step={1}
            onValueChange={(val)=>{
              setOpacity(val)
              setState({...state,opacity:val[0]})
            }}
          />
          <span className="text-lg">{opacity}%</span>
        </div>
        <Separator className="my-5 border border-gray-400" />

        {/* Plant To Plant Distance */}
         <div className="text-left space-y-2">
          <h4>Set Plant To Plant Distance (Feet)</h4>
          <Select>
            <SelectTrigger className="bg-white text-black w-full">
              <SelectValue placeholder="Plant To Plant Distance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 ft</SelectItem>
              <SelectItem value="2">2 ft</SelectItem>
              <SelectItem value="3">3 ft</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full rounded-[50px] bg-green-500 hover:bg-green-600 cursor-pointer">Submit</Button>
        </div>
        <Separator className="my-5 border border-gray-400" />

        {/* Polygons */}
        <div className="text-left space-y-2">
          <h4>Polygons Inside This Farm</h4>
          <Button className="w-full rounded-[50px] bg-green-500 hover:bg-green-600 cursor-pointer">Get Polygons As KML</Button>
          <Button className="w-full rounded-[50px] bg-green-500 hover:bg-green-600 cursor-pointer">Download Data</Button>
        </div>
        <Separator className="my-5 border border-gray-400" />

        {/* Select Colormap */}
        <div className="text-left space-y-2">
          <h4>Select Colormap</h4>
          <div className="rounded-lg p-2 bg-slate-800 space-y-1">
            <p className="text-xs">Use This When Vegetation is of Good Height</p>
            <div className="h-4 w-full bg-gradient-to-r from-green-500 via-yellow-300 to-red-600 rounded"></div>
          </div>
          <div className="rounded-lg p-2 bg-slate-800 space-y-1">
            <p className="text-xs">Use This When Vegetation is Small</p>
            <div className="h-4 w-full bg-gradient-to-r from-green-600 via-gray-200 to-black rounded"></div>
          </div>
        </div>
        <Separator className="my-5 border border-gray-400" />

        {/* Historical Data */}
        <div className="text-left space-y-2">
          <h4>Request Bulk Historical Satellite Data</h4>
          <Calender 
              CalenderIcon="right"
              ChevronIcon={false}
              dateFormat={"DD/MM/YYYY"}
              btnClassName={'w-full justify-between rounded py-[10px] bg-white-500 hover:bg-white-600'}/>
          <Calender 
              CalenderIcon="right"
              ChevronIcon={false}
              dateFormat={"DD/MM/YYYY"}
              btnClassName={'w-full justify-between rounded py-[10px] bg-white-500 hover:bg-white-600'}/>
          <Button className="w-full rounded-[50px] bg-green-500 hover:bg-green-600 cursor-pointer">Submit</Button>
        </div>
        <Separator className="my-5 border border-gray-400" />

        {/* Timelapse */}
        <div className="space-y-2">
          <Label>Generate Timelapse</Label>
          <Input
            type="number"
            value={timelapseSpeed}
            onChange={(e) => setTimelapseSpeed(parseFloat(e.target.value))}
            step="0.1"
          />
          <Label className="block">Number of Observations</Label>
          <RadioGroup defaultValue="5">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5" id="obs-5" />
              <Label htmlFor="obs-5">Last 5 Observations</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="10" id="obs-10" />
              <Label htmlFor="obs-10">Last 10 Observations</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="obs-all" />
              <Label htmlFor="obs-all">All Observations</Label>
            </div>
          </RadioGroup>
          <Select>
            <SelectTrigger className="bg-white text-black w-full">
              <SelectValue placeholder="Select Image Type" />
            </SelectTrigger>
            <SelectContent>
                {imageTypes.map((item:any) => (
                  <SelectItem
                   key={item.value} 
                   value={item.value}
                   className="py-0.5 px-2 text-xs" // tighter padding
                   >
                    {item.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button className="w-full rounded-[50px] bg-green-500 hover:bg-green-600 cursor-pointer">Submit</Button>
        </div>
        <Separator className="my-5 border border-gray-400" />

        {/* Compare Results */}
        <div className="text-left space-y-2">
          <h4>Compare Results</h4>
          <Select>
            <SelectTrigger className="bg-white text-black w-full">
              <SelectValue placeholder="Select Image Type" />
            </SelectTrigger>
            <SelectContent>
                {imageTypes.map((item:any) => (
                  <SelectItem
                   key={item.value} 
                   value={item.value}
                   className="py-0.5 px-2 text-xs" // tighter padding
                   >
                    {item.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Calender 
              CalenderIcon="right"
              ChevronIcon={false}
              dateFormat={"DD/MM/YYYY"}
              btnClassName={'w-full justify-between rounded py-[10px] bg-white-500 hover:bg-white-600'}/>
          <Calender 
              CalenderIcon="right"
              ChevronIcon={false}
              dateFormat={"DD/MM/YYYY"}
              btnClassName={'w-full justify-between rounded py-[10px] bg-white-500 hover:bg-white-600'}/>
          <Button className="w-full rounded-[50px] bg-green-500 hover:bg-green-600 cursor-pointer">Compare Images</Button>
        </div>

      </div>
    </div>
  )
}
