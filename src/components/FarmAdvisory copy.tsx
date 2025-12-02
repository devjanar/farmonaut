"use client";
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from "d3";
import Image from "next/image";
import { Share, Calendar, MapPin, Droplets, Leaf, Bug, AlertTriangle,Sprout } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { closeFarmAdvisor } from "@/store/FarmAdvisorSlice";
import dynamic from 'next/dynamic';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
// Dynamically import MapContainer and TileLayer to avoid SSR issues
import { useMap } from 'react-leaflet'; // must import normally
export const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
);
export const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
);
// import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import MyField from "@/components/MyField";
import { toggleMyField } from "@/store/MyFieldSlice";

import { IoShareSocial } from "react-icons/io5";
import { IoChevronDown, IoLogoYoutube, IoCaretDown, IoLocationSharp } from "react-icons/io5";

type DataItem = {
  label: string;
  value: number;
  color: string;
};
interface IrrigationScheduleProps {
  irrigationData: any[]; // You can replace 'any' with a proper type later
}

interface PestManagementProps {
  pestManagementData: any[]; // You can replace 'any' with a proper type later
}

interface FertilizerManagemenProps {
  fertilizerData: any[]; // You can replace 'any' with a proper type later
}

const data: DataItem[] = [
  { label: "Good Growth & Irrigation", value: 67.4, color: "#10B981" }, // green
  { label: "Requires Crop Health Attention", value: 0, color: "#EF4444" }, // red
  { label: "Requires Irrigation Attention", value: 32.6, color: "#7C3AED" }, // purple
  { label: "Critical Crop Health & Irrigation", value: 0, color: "#3B82F6" }, // blue
  { label: "Cloud Cover / No Crop", value: 0, color: "#9CA3AF" }, // gray
];


const Header=()=> {
  return( 
    <div className="bg-teal-600 text-white p-2 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-teal-600 font-bold text-sm">J</span>
          </div>
          <span className="font-bold">JEEVN AI</span>
        </div>
        <div className="flex items-center space-x-2">
          <Image
            src="/logo_white.jpg"
            width={40}
            height={40}
            alt="Logo"
            className="rounded"
          />
        </div>
      </div>
      <h1 className="text-[30px] font-bold flex-1 text-center">Personalized Farm Advisory</h1>
      <div className="flex items-center space-x-4">
        <Select>
          <SelectTrigger className="bg-white w-[150px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bangla">Bangla</SelectItem>
            <SelectItem value="english">English</SelectItem>
          </SelectContent>
        </Select>
        <Button
            className="bg-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm 
            text-gray-600 hover:bg-gray-100 border border-gray-200 cursor-pointer"
          >
          <IoShareSocial className="w-4 h-4" />
          <span>Share Report</span>
        </Button>
        <div className='flex flex-col item-center'>
          <span className='text-[12px]'>
            Report Date: 22 Sep 2025
          </span>  
            <span className='text-[10px]'>
          Total Fields: 2
          </span> 
        </div>
      </div>
    </div>
  )
}

const AnalysisScale: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    // Create tooltip div (appended to body so it floats over everything)
    const tooltip = document.createElement("div");
    tooltipRef.current = tooltip;
    Object.assign(tooltip.style, {
      position: "absolute",
      pointerEvents: "none",
      background: "white",
      border: "1px solid #e5e7eb",
      padding: "6px 10px",
      fontSize: "12px",
      borderRadius: "6px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
      opacity: "0",
      transition: "opacity 0.12s ease",
      zIndex: "9999",
    });
    document.body.appendChild(tooltip);

    // Dimensions
    const width = 160;
    const height = 160;
    const radius = Math.min(width, height) / 2;

    // Clean SVG
    d3.select(svgEl).selectAll("*").remove();

    // Root group
    const svg = d3
      .select(svgEl)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Pie & arc generators
    const pie = d3.pie<DataItem>().sort(null).value((d) => d.value);
    const arcGen = d3
      .arc<d3.PieArcDatum<DataItem>>()
      .innerRadius(0) // change to >0 for donut
      .outerRadius(radius - 8);

    // Filter out zero values for drawing (keeps legend intact)
    const nonZero = data.filter((d) => d.value > 0);

    // Guard: nothing to draw
    if (nonZero.length === 0) {
      // optionally show empty state
      d3.select(svgEl).append("text").text("No data").attr("x", 10).attr("y", 20);
      return () => {
        if (tooltipRef.current?.parentNode) tooltipRef.current.parentNode.removeChild(tooltipRef.current);
      };
    }

    const arcs = svg
      .selectAll("path")
      .data(pie(nonZero))
      .enter()
      .append("path")
      .attr("d", (d) => arcGen(d) as string)
      .attr("fill", (d) => d.data.color)
      .style("stroke", "#fff")
      .style("stroke-width", "2px");

    // Hover interactions: tooltip + small "pop-out"
    arcs
      .on("mouseover", function (event: any, d: d3.PieArcDatum<DataItem>) {
        if (!tooltipRef.current) return;
        tooltipRef.current.style.opacity = "1";
        tooltipRef.current.innerHTML = `<strong>${d.data.label}</strong><br/>${d.data.value.toFixed(
          1
        )}%`;

        // simple pop out: translate slightly along centroid direction
        d3.select(this)
          .transition()
          .duration(120)
          .attr("transform", function (arcDatum: any) {
            const [x, y] = arcGen.centroid(arcDatum);
            const len = Math.sqrt(x * x + y * y) || 1;
            const offset = 8; // pixels to pop out
            return `translate(${(x / len) * offset}, ${(y / len) * offset})`;
          });
      })
      .on("mousemove", function (event: MouseEvent) {
        if (!tooltipRef.current) return;
        tooltipRef.current.style.left = event.pageX + 12 + "px";
        tooltipRef.current.style.top = event.pageY - 28 + "px";
      })
      .on("mouseout", function () {
        if (!tooltipRef.current) return;
        tooltipRef.current.style.opacity = "0";
        d3.select(this).transition().duration(120).attr("transform", "translate(0,0)");
      });

    // Cleanup on unmount
    return () => {
      if (tooltipRef.current && tooltipRef.current.parentNode) {
        tooltipRef.current.parentNode.removeChild(tooltipRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-lg p-3">
      <div className="flex justify-between items-center pb-2">
        <h3 className="font-bold text-green-600">ANALYSIS SCALE</h3>
        <Button className="bg-white rounded-4xl text-teal-600 px-3 py-1 border cursor-pointer
          hover:bg-teal-600 hover:text-white transition-colors duration-200 h-[auto]">
          Details &gt;
        </Button>
      </div>

      <div className="bg-gray-200 rounded p-[7px] flex flex-col items-center">
        {/* chart */}
        <svg ref={svgRef} />

        {/* legend (keeps zeros visible) */}
        <div className="space-y-2.5 text-sm mt-1.5">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
              <span>
                {item.value.toFixed(1)}% {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Map=()=> {
  const mapRef = useRef<L.Map | null>(null);

  return (
    <div className="relative h-[40vh] w-full rounded-2xl overflow-hidden">
      <MapContainer
        center={[23.825, 90.425]} // initial center
        zoom={15}
        zoomControl={true}
        style={{ height: "100%", width: "100%" }}
        ref={(mapInstance) => {
          if (mapInstance) mapRef.current = mapInstance;
        }}
      >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye"
          />
      </MapContainer>
    </div>
  );
}

const IrrigationSchedule: React.FC<IrrigationScheduleProps> = ({ irrigationData }) => {
  return(
     <div className="bg-white rounded"> 
        <div className="p-2 mb-1 flex items-center justify-between border-b">
          <h3 className="font-semibold flex items-center gap-2">
          <Sprout/> Irrigation schedule
          </h3>
          <Button className="bg-white rounded-4xl text-teal-600 px-3 py-1 border cursor-pointer
            hover:bg-teal-600 hover:text-white transition-colors duration-200 h-[auto]">
            Details &gt;
          </Button>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[14px]">
                  <th className="pb-2">Date<br/><span className="text-xs text-gray-500">dd/mm/yy</span></th>
                  <th className="pb-2">Optimal Time<br/><span className="text-xs text-gray-500">HH:MM</span></th>
                  <th className="pb-2">quantity</th>
                  <th className="pb-2">Evapotranspiration</th>
                  <th className="pb-2">Rainfall<br/><span className="text-xs text-gray-500">mm</span></th>
                  <th className="pb-2">Probability<br/><span className="text-xs text-gray-500">%</span></th>
                </tr>
              </thead>
              <tbody>
                {irrigationData.map((row, index) => (
                  <tr key={index} className="text-[14px]">
                    <td className="py-2">{row.date}</td>
                    <td className="py-2">{row.time}</td>
                    <td className="py-2">{row.quantity}</td>
                    <td className="py-2">
                      <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded text-xs">
                        {row.evapotranspiration}
                      </span>
                    </td>
                    <td className="py-2">{row.rainfall}</td>
                    <td className="py-2">{row.probability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  )
}

const PestManagement:React.FC<PestManagementProps> =({ pestManagementData })=> {
  return(
    <div className="bg-white rounded"> 
      <div className="p-2 mb-1 flex items-center justify-between border-b">
        <h3 className="font-bold flex items-center space-x-2">
          <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
            <Bug className="w-4 h-4 text-white" />
          </div>
          <span>Pest, Disease, And Weed Management</span>
        </h3>
        <Button className="bg-white rounded-4xl text-teal-600 px-3 py-1 border cursor-pointer
          hover:bg-teal-600 hover:text-white transition-colors duration-200 h-[auto]">
          Details &gt;
        </Button>
      </div>
      <div className="overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[14px]">
              <th className="pb-2">Category</th>
              <th className="pb-2">Risk</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Organic Sol.</th>
              <th className="pb-2">Chemical Sol.</th>
            </tr>
          </thead>
          <tbody>
            {pestManagementData.map((row, index) => (
              <tr key={index} className="text-[14px]">
                <td className="py-2">
                  <div className="flex items-center space-x-1">
                    {row.category === 'Pest' && <AlertTriangle className="w-5 h-3 text-red-500" />}
                    {row.category === 'Disease' && <span className="w-5 h-3 text-blue-500">💧</span>}
                    {row.category === 'Weed' && <span className="w-5 h-3 text-green-500">🌿</span>}
                    <span>{row.category}</span>
                  </div>
                </td>
                <td className="py-2">
                  <span className={`px-2 py-2 rounded ${
                    row.risk === 'High' ? 'text-red-600' : 'text-orange-600'
                  }`}>
                    {row.risk}
                  </span>
                </td>
                <td className="py-2">{row.type}</td>
                <td className="py-2">{row.organicSol}</td>
                <td className="py-2">{row.chemicalSol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>              
  </div>
  )
}

const FertilizerManagement:React.FC<FertilizerManagemenProps> =({fertilizerData})=> {
  return(
    <div className="col-span-7">
        <div className="bg-white rounded-lg p-2 h-[325px] overflow-y-auto">
          <div className="p-1 flex items-center justify-between border-b">
            <h3 className="font-bold flex items-center gap-2">
                <Leaf />
              <span>Fertilizer Management</span>
            </h3>
              {/* Frequency */}
            <div className="text-center">
              <div className="font-bold text-[10px]">Every 0 days</div>
              <div className="text-[10px] text-gray-600">Frequency Of Application</div>
            </div>
            <Button className="bg-white rounded-4xl text-teal-600 text-[12px] px-3 py-1 border cursor-pointer
              hover:bg-teal-600 hover:text-white transition-colors duration-200 h-[auto]">
              Details &gt;
            </Button>
          </div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="text-teal-700 text-left border-b">
                  <th className="py-2 px-2 font-semibold">Nutrients</th>
                  <th className="py-2 px-2 font-semibold">Soil composition<br /><span className="font-normal">(Current | Ideal kg/acre)</span></th>
                  <th className="py-2 px-2 font-semibold">Organic Sol.<br /><span className="font-normal">(Rate kg/acre)</span></th>
                  <th className="py-2 px-2 font-semibold">Chemical Sol.<br /><span className="font-normal">(Rate kg/acre)</span></th>
                </tr>
              </thead>
              <tbody>
                {fertilizerData.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-2 font-medium">{item.nutrient}</td>
                    <td className="py-2 px-2">{item.current} | {item.ideal}</td>
                    <td className="py-2 px-2">{item.organicSol}</td>
                    <td className="py-2 px-2">{item.chemicalSol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  )
}




export default function FarmAdvisoryModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.farmadvisor.isOpen);
  const isOpenMyfield = useSelector((state: RootState) => state.myfield.isOpen);

  const irrigationData: any[] = [
    { date: '21/09/25', time: '05:00-08:00', quantity: 6, evapotranspiration: 'Moderate', rainfall: 0, probability: 0 },
    { date: '22/09/25', time: '05:00-08:00', quantity: 0, evapotranspiration: 'Moderate', rainfall: 0, probability: 0 },
    { date: '23/09/25', time: '05:00-08:00', quantity: 6, evapotranspiration: 'Moderate', rainfall: 0, probability: 0 },
    { date: '24/09/25', time: '05:00-08:00', quantity: 0, evapotranspiration: 'Moderate', rainfall: 0, probability: 0 },
    { date: '25/09/25', time: '05:00-08:00', quantity: 6, evapotranspiration: 'Moderate', rainfall: 0, probability: 0 },
    { date: '26/09/25', time: '05:00-08:00', quantity: 0, evapotranspiration: 'Moderate', rainfall: 0, probability: 0 },
    { date: '27/09/25', time: '05:00-08:00', quantity: 6, evapotranspiration: 'Moderate', rainfall: 0, probability: 0 }
  ];

  const pestManagementData = [
    { category: 'Pest', risk: 'Moderate', type: 'Stem borer', organicSol: 'Pheromone traps', chemicalSol: 'Chlorantraniliprole granules' },
    { category: 'Pest', risk: 'Moderate', type: 'Brown planthopper', organicSol: 'Biological control', chemicalSol: 'Buprofezin spray' },
    { category: 'Disease', risk: 'Moderate', type: 'Bacterial leaf blight', organicSol: 'Resistant varieties', chemicalSol: 'Streptomycin spray' },
    { category: 'Disease', risk: 'Moderate', type: 'Sheath blight', organicSol: 'Wider spacing', chemicalSol: 'Validamycin application' },
    { category: 'Weed', risk: 'High', type: 'Echinochloa crus-galli', organicSol: 'Manual weeding', chemicalSol: 'Pretilachlor application' },
    { category: 'Weed', risk: 'High', type: 'Cyperus difformis', organicSol: 'Water management', chemicalSol: 'Bensulfuron-methyl' }
  ];

  const fertilizerData = [
    { nutrient: 'Nitrogen', current: 10, ideal: '9.1-18.2', organicSol: 'Farmyard manure (0)', chemicalSol: 'Urea (0)' },
    { nutrient: 'Phosphorus', current: 10, ideal: '9.1-18.2', organicSol: 'Farmyard manure (0)', chemicalSol: 'Triple Super Phosphate (TSP) (0)' },
    { nutrient: 'Potassium', current: 10, ideal: '9.1-0-136.5', organicSol: 'Farmyard manure (0)', chemicalSol: 'Muriate of Potash (MoP) (0)' },
    { nutrient: 'Sulfur', current: 10, ideal: '4.6-9.1', organicSol: 'Farmyard manure (0)', chemicalSol: 'Gypsum (0)' },
    { nutrient: 'Zinc', current: 10, ideal: '0.9-1.8', organicSol: 'Farmyard manure (0)', chemicalSol: 'Zinc sulfate (0)' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={() => dispatch(closeFarmAdvisor())}>
      <DialogContent
        hideClose
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="w-[95vw] !max-w-none max-h-[98vh] flex flex-col 
        bg-green-300 dark:bg-gray-800 rounded-md p-1 overflow-y-auto"
      >
        <DialogHeader>
            <DialogTitle className='flex item-center justify-end mb-1 gap-2'>
            <Button className="bg-teal-500 hover:bg-teal-600 px-3 py-1 rounded-lg text-sm cursor-pointer">
              Request Report
            </Button>
            <Button className="bg-white hover:bg-gray-200 px-3 py-1 rounded-lg text-sm text-gray cursor-pointer border border-gray-300" 
              onClick={() => dispatch(closeFarmAdvisor())}>
              X
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="bg-teal-600">
          {/* Header */}
          <Header/>
          {/* Main Content */}
          <div className="gap-1 p-2 bg-gray-100 w-full"> 
            <div className="grid grid-cols-12 gap-1 mb-1 w-full">
              {/* Left column content */}
              <div className="col-span-7">
                <div className="grid grid-cols-12 gap-1 w-full">  
                  <div className="col-span-8 relative">
                    {/* Map */}
                    <div className="bg-white rounded-lg p-1 relative">
                      {/* Map Component */}
                      <Map/>
                      {/* My Fields Button opens modal via Redux */}
                      <div className="bg-white w-11/12 absolute bottom-6 left-3 flex items-center justify-between z-[1000] p-2 rounded-md">
                        {/* Left: My Fields */}
                        <div className="relative">
                          <Button
                            variant="outline"
                            className="bg-teal-600 hover:bg-teal-700 min-w-[200px] rounded text-[16px] 
                            flex items-center justify-between cursor-pointer text-white"
                            onClick={() => dispatch(toggleMyField())}
                          >
                            <span className="flex-1 text-center">My Fields</span>
                            <IoChevronDown className="w-5 h-5 mr-2" />
                          </Button>

                          {isOpenMyfield && (
                            <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-200 rounded-md shadow-lg">
                              <MyField
                                btn={false}
                                items={[]}
                                placeholder="Search fields..."
                                maxWidth={200}
                                onSubmit={(selectedItems) => {
                                  console.log("Selected items:", selectedItems);
                                }}
                              />
                            </div>
                          )}
                        </div>
                        {/* Center: Frequency */}
                        <div className="absolute left-1/2 -translate-x-1/2 text-center">
                          <div className="font-bold text-[10px]">Every 0 days</div>
                          <div className="text-[10px] text-gray-600">Frequency Of Application</div>
                        </div>
                        {/* Right: Language */}
                        <div className="relative">
                          <Select>
                            <SelectTrigger className="text-[18px] bg-teal-600 w-[150px] text-white rounded 
                            [&_[data-placeholder]]:text-white [&>span]:text-white placeholder:text-white">
                              <SelectValue placeholder="Language" />
                            </SelectTrigger>
                              <SelectContent className="z-50 bg-white">
                                <SelectItem value="bangla">Bangla</SelectItem>
                                <SelectItem value="english">English</SelectItem>
                              </SelectContent>
                            </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-4">
                    {/* Analysis Scale */}
                    <AnalysisScale/>
                  </div>
                </div>
              </div>
              {/* Right column content */}
              <div className="col-span-5">
                {/* Irrigation Schedule */}
                <IrrigationSchedule irrigationData={irrigationData}/>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-1 w-full">
              {/* Left Panel - Map and Field Info */}
              <div className="col-span-6">
                <div className="grid grid-cols-12 gap-1 items-stretch h-[325px]">
                  <div className="col-span-5">
                    {/* Soil Management */}
                    <div className="bg-white rounded-lg p-2 mb-1">
                      <div className="p-1 flex items-center justify-between border-b">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Leaf/> Soil Management
                        </h3>
                        <Button className="bg-white rounded-4xl text-teal-600 text-[12px] px-3 py-1 border cursor-pointer
                          hover:bg-teal-600 hover:text-white transition-colors duration-200 h-[auto]">
                          Details &gt;
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center py-2.5">
                        <div>
                          <div className="font-bold text-lg">0.11 %</div>
                          <div className="text-sm text-gray-600">SOC</div>
                        </div>
                        <div>
                          <div className="font-bold text-lg">6.5</div>
                          <div className="text-sm text-gray-600">Ph</div>
                        </div>
                        <div>
                          <div className="font-bold text-lg">low</div>
                          <div className="text-sm text-gray-600">Salinity</div>
                        </div>
                      </div>
                    </div>
                    {/* Growth & Yield */}
                    <div className="bg-white rounded-lg p-2">
                      {/* Header */}
                      <div className="p-1 flex items-center justify-between border-b">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-green-600" /> Growth & Yield
                        </h3>
                        <Button className="bg-white rounded-4xl text-teal-600 text-[12px] px-3 py-1 border cursor-pointer
                          hover:bg-teal-600 hover:text-white transition-colors duration-200 h-[auto]">
                          Details &gt;
                        </Button>
                      </div>
                      {/* Grid Items */}
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {/* Total Expected Yield */}
                        <div className="flex flex-col">
                          <div className="flex items-center font-bold gap-2">
                            <Leaf className="w-4 h-4 text-green-600" />
                            <span>1044.90 kg</span>
                          </div>
                          <span className="text-sm text-gray-600">Total Expected Yield</span>
                        </div>
                        {/* Expected Yield */}
                        <div className="flex flex-col">
                          <div className="flex items-center font-bold gap-2">
                            <Leaf className="w-4 h-4 text-green-600" />
                            <span>2150 kg/acre</span>
                          </div>
                          <span className="text-sm text-gray-600">Expected Yield</span>
                        </div>
                        {/* Harvest Period */}
                        <div className="flex flex-col">
                          <div className="flex items-center font-bold gap-2">
                            <Leaf className="w-4 h-4 text-green-600" />
                            <span>January 2026</span>
                          </div>
                          <span className="text-sm text-gray-600">Harvest Period</span>
                        </div>
                        {/* Crop Name */}
                        <div className="flex flex-col">
                          <div className="flex items-center font-bold gap-2">
                            <Leaf className="w-4 h-4 text-green-600" />
                            <span>Rice</span>
                          </div>
                          <span className="text-sm text-gray-600">Crop Name</span>
                        </div>
                      </div>
                      {/* Footer Note */}
                      <div className="text-xs text-gray-500 mt-3">
                        ⚠ The yield is for the ongoing harvest cycle only
                      </div>
                    </div>
                  </div>
                  {/* Fertilizer Management */}
                  <FertilizerManagement fertilizerData={fertilizerData}/>
                </div>
              </div>
              {/* Right Panel - Details and Management */}
              <div className="col-span-6">
                  {/* Pest, Disease, And Weed Management */}
                  <PestManagement pestManagementData={pestManagementData}/>
              </div>
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="p-2 bg-teal-600 text-white text-center text-sm">
            <span className="inline-flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>DISCLAIMER: This farm advisory report is AI-generated and should be used as a general guide only. All recommendations should be verified by agricultural experts and adapted to local conditions before implementation.</span>
            </span>
          </div>
       </div>
      </DialogContent>
    </Dialog>
  );
}