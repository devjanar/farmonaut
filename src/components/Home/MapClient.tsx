"use client";
import {API} from "@/apiEnv"
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useMap } from "react-leaflet";
import { MapContainer, TileLayer, Polygon, ImageOverlay } from "react-leaflet";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { openHomeWithData,openHome } from "@/store/HomeSlice";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { LatLngTuple } from "leaflet";
import { Button } from "@/components/ui/button";
import { Calender } from "@/components/common";
import { convertToHectares,convertToAcres } from "@/service";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import FieldDetailModal from "./FieldDetailModal";
import {  Trash2, Edit2, Pause } from "lucide-react";
import { IoChevronDown, IoDocumentTextOutline, IoPencil, IoLocationSharp } from "react-icons/io5";
import { FaMapLocationDot } from "react-icons/fa6";
import { PiRectangleDashedDuotone } from "react-icons/pi";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Info,Image } from "lucide-react";
import { Loader } from "@/components/element";


const RVI_COLORMAP = [
  { min: 0.9, max: 1.0, color: "#06653d", label: "Good" },
  { min: 0.8, max: 0.9, color: "#11a75f", label: "Good" },
  { min: 0.7, max: 0.8, color: "#81bf6c", label: "Medium" },
  { min: 0.6, max: 0.7, color: "#bae383", label: "Medium" },
  { min: 0.5, max: 0.6, color: "#e6f3a4", label: "Medium" },
  { min: 0.4, max: 0.5, color: "#fff0b5", label: "Medium" },
  { min: 0.3, max: 0.4, color: "#fbc07e", label: "Bad" },
  { min: 0.2, max: 0.3, color: "#f7885a", label: "Bad" },
  { min: 0.1, max: 0.2, color: "#ea4f3b", label: "Bad" },
  { min: -1.0, max: 0.1, color: "#ab0535", label: "Bad" }
];

// Example polygon (your coordinates, flipped lat/lng)
// const polygonCoords: LatLngTuple[] = [
//   [90.478141, 23.827754],
//   [90.478635, 23.827179],
//   [90.479558, 23.827926],
//   [90.478951, 23.828417],
//   [90.478141, 23.827754],
// ].map(([lng, lat]) => [lat, lng] as LatLngTuple); 


function RviLegend() {
  return (
    <div className="absolute bottom-4 left-4 bg-white rounded-md shadow-md p-2 z-[1000]">
      <h4 className="font-semibold mb-2">Analysis Scale (RVI)</h4>
      <div className="flex flex-col space-y-1">
        {RVI_COLORMAP.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div style={{ background: item.color, width: 20, height: 12 }} />
            <span className="text-sm">
              {item.min} – {item.max}: {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const DeleteActionAlert=({handleDelete}:any)=> {

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="cursor-pointer flex items-center gap-1 text-gray-600 hover:text-gray-900">
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-sm sm:w-full text-center">
         <AlertDialogHeader className="items-center justify-center text-center">
          <AlertDialogTitle className="text-lg font-semibold">
            Delete Field
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600 mt-1">
            Are you sure you want to delete this field?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="block item-center justify-center space-x-3 mt-6">
          <AlertDialogCancel className="rounded-[20px] p-[20px] cursor-pointer bg-green-400 hover:bg-green-600 text-white">No</AlertDialogCancel>
          <AlertDialogAction className="rounded-[20px] p-[20px] cursor-pointer bg-red-400 hover:bg-red-600" onClick={handleDelete}>Yes</AlertDialogAction>
        </AlertDialogFooter>
        
      </AlertDialogContent>
    </AlertDialog>
  )
}

const SelectImageType = ({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (value: string) => void;
}) => {
  const sections = [
    {
      title: "For Basic Analysis",
      items: [{ id: "hybrid", label: "Hybrid" }],
    },
    {
      title: "For Colorblind Visualization",
      items: [{ id: "colorblind", label: "Colorblind Visualization" }],
    },
    {
      title: "For Colored Satellite Image",
      items: [
        { id: "tci", label: "TCI" },
        { id: "etci", label: "ETCI" },
      ],
    },
    {
      title: "For Early Growth Stage Crop Health",
      items: [
        { id: "ndvi", label: "NDVI", default: true },
        { id: "evi", label: "EVI" },
        { id: "savi", label: "SAVI" },
      ],
    },
    {
      title: "For Later Growth Stage Crop Health",
      items: [{ id: "ndre", label: "NDRE" }],
    },
    {
      title: "For Irrigation",
      items: [
        { id: "ndwi", label: "NDWI" },
        { id: "evapotranspiration", label: "Evapotranspiration" },
        { id: "ndmi", label: "NDMI" },
      ],
    },
    {
      title: "For Soil Health",
      items: [{ id: "soc", label: "SOC" }],
    },
    {
      title: "For Topography",
      items: [{ id: "dem", label: "DEM" }],
    },
    {
      title: "For Land Use Land Classification",
      items: [{ id: "lulc", label: "LULC" }],
    },
    {
      title: "Select Image Type for Cloudy Weather",
      items: [
        { id: "rvi", label: "Crop Health (RVI)" },
        { id: "rsm", label: "Soil Moisture (RSM)" },
      ],
    },
  ];

  return (
    <Card className="w-80 h-[78vh] border border-gray-200 shadow-md rounded-xl overflow-y-scroll">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Select Image Type</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.map((section) => (
          <div key={section.title} className="border-t first:border-t-0 pt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">{section.title}</p>
            <RadioGroup
              defaultValue={section.items.find((i) => i.default)?.id ?? ""}
              value={selected} // controlled component
              onValueChange={onChange}
              className="space-y-1"
            >
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Label htmlFor={item.id} className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value={item.id} id={item.id} />
                    <span>{item.label}</span>
                  </Label>
                  <Info size={16} className="text-gray-400" />
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const FieldToolbar=({data,handleDelete}:any)=>{ 
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImageType, setSelectedImageType] = useState("ndvi"); // default value
  const date=moment(data.LatestDay || new Date(), "YYYYMMDD").toDate()
  const sections = [
    {
      title: "For Basic Analysis",
      items: [{ id: "hybrid", label: "Hybrid" }],
    },
    {
      title: "For Colorblind Visualization",
      items: [{ id: "colorblind", label: "Colorblind Visualization" }],
    },
    {
      title: "For Colored Satellite Image",
      items: [
        { id: "tci", label: "TCI" },
        { id: "etci", label: "ETCI" },
      ],
    },
    {
      title: "For Early Growth Stage Crop Health",
      items: [
        { id: "ndvi", label: "NDVI", default: true },
        { id: "evi", label: "EVI" },
        { id: "savi", label: "SAVI" },
      ],
    },
    {
      title: "For Later Growth Stage Crop Health",
      items: [{ id: "ndre", label: "NDRE" }],
    },
    {
      title: "For Irrigation",
      items: [
        { id: "ndwi", label: "NDWI" },
        { id: "evapotranspiration", label: "Evapotranspiration" },
        { id: "ndmi", label: "NDMI" },
      ],
    },
    {
      title: "For Soil Health",
      items: [{ id: "soc", label: "SOC" }],
    },
    {
      title: "For Topography",
      items: [{ id: "dem", label: "DEM" }],
    },
    {
      title: "For Land Use Land Classification",
      items: [{ id: "lulc", label: "LULC" }],
    },
    {
      title: "Select Image Type for Cloudy Weather",
      items: [
        { id: "rvi", label: "Crop Health (RVI)" },
        { id: "rsm", label: "Soil Moisture (RSM)" },
      ],
    },
  ];

  return (
    <>  
    <div className="w-full flex items-center gap-8 p-2 mb-4">
      {/* Field Details dropdown */}
      <div className="relative">
         <Button
            variant="outline"
            className="min-w-[220px] rounded-[50px] py-[14px] px-0 text-[15px] flex items-center justify-between cursor-pointer"
              onClick={() => {
              // dispatch(openFieldDetail());
              setIsOpen(true)
            }}
          >
            <IoDocumentTextOutline className="w-5 h-5 ml-3" />
            <span className="flex-1 text-center">Field Details </span>
            <IoChevronDown className="w-5 h-5 mr-3" />
          </Button>
      </div>

      {/* Field info */}
      <div className="flex items-center gap-2 text-[15px] text-gray-700">
        <FaMapLocationDot className="w-4 h-4 text-gray-500" />
        <span>Field: {data.FieldDescription || null}</span>
      </div>

      {/* Area */}
      <div className="flex items-center gap-2 text-[15px] text-gray-700">
        <PiRectangleDashedDuotone className="w-4 h-4 text-gray-500" />
        <span>Area: {convertToHectares(data.FieldArea || 0)} Ha, {convertToAcres(data.FieldArea || 0)} acres</span>
      </div>

      {/* Date Picker */}
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <Calender value={ date || new Date()}/>
      </div>

      {/* Dropdown (RVI etc.) */}
      <div className=" px-2 py-1 text-sm text-gray-700">
        <Popover>
          <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="relative w-[180px] bg-white border border-gray-300 text-gray-800 rounded-full py-[14px] px-4 hover:bg-gray-100 flex items-center justify-between"
          >
            <Image size={18} className="text-gray-600" />
              <span className="absolute left-1/2 transform -translate-x-1/2">
                    {sections.find((s) =>
                      s.items.some((i) => i.id === selectedImageType)
                    )?.items.find((i) => i.id === selectedImageType)?.label ||
                      "Image Type"}
                  </span>
          </Button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"      
            align="start"     
            sideOffset={8}
            className="p-0 w-[320px] shadow-lg border border-gray-200 rounded-xl"
          >
            <SelectImageType
                  selected={selectedImageType}
                  onChange={setSelectedImageType}
                />
          </PopoverContent>
        </Popover>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-8 text-sm">
        <button className="cursor-pointer flex items-center gap-1 text-gray-600 hover:text-gray-900">
          <Pause className="w-4 h-4" />
          Pause
        </button>
        <DeleteActionAlert data={data} handleDelete={handleDelete}/>
        <button className="cursor-pointer flex items-center gap-1 text-gray-600 hover:text-gray-900">
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
      </div>
    </div>
    {isOpen && (
        <FieldDetailModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          data={data}
        />
      )}
    </>
  );
}

export default function MapClient() {
  const [mapType, setMapType] = useState("satellite");
  const mapRef = useRef<L.Map | null>(null);
  const {data,isOpen} = useSelector((state: RootState) => state.home);
  const {dataControl} = useSelector((state: RootState) => state.mapcontrol);
  console.log(dataControl,"dataControl")
  // console.log("Home modal data:", data);
  const [state, setState] = useState<any>({});
  const [mapControl, setMapControl] = useState<any>();
  const [polygonCoords, setPolygonCoords] = useState<LatLngTuple[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFarmDetails = async (param:any) => {
    setLoading(true);
    try {
      setState({});
      const res = await fetch(`${API}/field/getFieldDetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({data:param}),
      });
      const dataValue = await res.json();
      console.log("Fetched:", dataValue.data);
      if(dataValue.data){
        setState(dataValue.data);
        //Extract coordinates and convert to LatLngTuple
        const latLngCoords = Object.values(dataValue.data.Coordinates || {}).map(
            (p: any) => [p.Latitude, p.Longitude] as LatLngTuple
          ).map(([lat, lng]) => [lat, lng] as [number, number]);

        setPolygonCoords(
          latLngCoords
        );
      }
    } catch (error) {
      console.error("Error fetching fields:", error);
    } finally {
       setLoading(false);
    }
  };

   const handleDelete = async () => {
    try {
      const res = await fetch(`${API}/field/deleteField`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({data:state}),
      });
      const result = await res.json();
      setTimeout(async() => {
        await fetchFarmDetails(null);
      }, 10000)
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete field.");
    }
  };

  useEffect(()=>{
    setMapControl(dataControl)
  },[dataControl])

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      const dataValue = await fetchFarmDetails(data);
      if (ignore) return;
    };
    fetchData();
    return () => {
      ignore = true;
    };
  }, [data]);

  useEffect(() => {
    if (polygonCoords.length && mapRef.current) {
      const coordinate = polygonCoords[0];
      const roundedLat = Number(coordinate[0]);
      const roundedLon = Number(coordinate[1]);
      console.log("Centering map to:", roundedLat, roundedLon);

      // Give Leaflet a tick to render layers first
      setTimeout(() => {
        mapRef.current?.setView([roundedLat, roundedLon], 18);
      }, 100);
    }
  }, [polygonCoords]);

  if(loading && !state.FieldID){
    return (
        <Loader />
      )
  }

  return (
    <div className="flex flex-col items-center justify-center"> 
      <FieldToolbar data={state} handleDelete={handleDelete} />
      <div className={`${loading && !state.FieldID ? 'hidden' : 'relative h-[80vh] w-full rounded-2xl overflow-hidden'}`} style={{ zIndex: 0 }}>
        {/* Top Bar */}
        <div className="absolute top-4 left-0 w-full z-[1000] flex items-center px-4">
          <div className="flex gap-2">
            <Button
              className={`px-7 py-4 rounded-1xl font-semibold transition-all duration-300 min-w-[120px] text-[18px] cursor-pointer
                ${mapType === "map" 
                ? "bg-green-500 text-white shadow-md hover:bg-green-600" 
                : "bg-white text-gray-700 shadow-sm hover:bg-gray-100"}`}
              onClick={() => setMapType("map")}
            >
              Map
            </Button>
            <Button
              className={`px-7 py-4 rounded-1xl font-semibold transition-all duration-300 min-w-[120px] text-[18px] cursor-pointer
                ${mapType === "satellite" 
                ? "bg-green-500 text-white shadow-md hover:bg-green-600" 
                : "bg-white text-gray-700 shadow-sm hover:bg-gray-100"}`}
              onClick={() => setMapType("satellite")}
            >
              Satellite
            </Button>
          </div>
        </div>
        <MapContainer
          center={[23.8, 90.4]} 
          zoom={18}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
          ref={(mapInstance) => {
            if (mapInstance) mapRef.current = mapInstance;
          }}
        >
          {mapType === "map" && (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
          )}
          {mapType === "satellite" && (
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye"
            />
          )}
          {/* Draw Polygon */}
          <Polygon
            positions={polygonCoords || []}
            pathOptions={{ color: "green", weight: 3, fillOpacity: mapControl && mapControl.opacity?Number(mapControl.opacity) / 100:0.3 }}
          />
        </MapContainer>
        <RviLegend />
      </div>
    </div> 
  );
}
