"use client";
import {API} from "@/apiEnv"
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import * as d3 from "d3";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calender, TimeSeriesChart } from "@/components/common";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "@/components/element";

// Today
// End = today
const endDat = moment().toDate(); 
// Start = 1 month ago
const startDat = moment().subtract(1, "month").toDate();

type IndexKey = "NDVI" | "NDWI" | "NDRE";

export interface IndexData {
  date: string; // YYYY-MM-DD
  [key: string]: number | string; // dynamic keys for indices like NDVI, NDWI, etc.
}

// Raw API data interface
export interface RawIndexData {
  [key: string]: { [date: string]: string }; // e.g., ndvi: { "20240420": "17" }
}

interface NamedIndex {
  key: string;
  name: string;
    values: { date: string; value: string }[];
}

const filterIndexValues=["ndvi", "ndre", "evi", "vari", "ndwi"];
const filterIndexColor = [
  { name: "ndvi", color: "#60A5FA" },
  { name: "ndre", color: "#F87171" },
  { name: "evi",  color: "#34D399" },
  { name: "vari", color: "#A78BFA" },
  { name: "ndwi", color: "#b9f8cf" },
];

// interface IndexData {
//   date: string;
//   NDVI: number;
//   NDWI: number;
//   NDRE?: number;
// }

// const sampleData: IndexData[] = [
//   { date: "2025-09-10", NDVI: 65, NDWI: 60, NDRE: 50 },
//   { date: "2025-09-14", NDVI: 10, NDWI: 30, NDRE: 20 },
//   { date: "2025-09-20", NDVI: 45, NDWI: 50, NDRE: 15 },
//   { date: "2025-09-26", NDVI: 5, NDWI: 35, NDRE: 10 },
//   { date: "2025-09-30", NDVI: 10, NDWI: 60, NDRE: 40 },
//   { date: "2025-10-02", NDVI: 25, NDWI: 45, NDRE: 35 },
//   { date: "2025-10-05", NDVI: 50, NDWI: 55, NDRE: 42 },
// ];

const indicesMeta = [
  { label: "NDVI", value: "NDVI", color: "#ef4444" },
  { label: "NDWI", value: "NDWI", color: "#3b82f6" },
  { label: "NDRE", value: "NDRE", color: "#10b981" },
];

const TimeSeriesChartData = [
  { date: "2025-09-10", value: 65 },
  { date: "2025-09-14", value: 10 },
  { date: "2025-09-18", value: 8 },
  { date: "2025-09-22", value: 9 },
  { date: "2025-09-26", value: 11 },
  { date: "2025-10-02", value: 30 },
  { date: "2025-10-08", value: 60 },
];

const chartConfigs = [
  { key: "NDVI", title: "NDVI (Time Series)", color: "#60A5FA" },
  { key: "NDRE", title: "NDRE (Time Series)", color: "#F87171" },
  { key: "EVI", title: "EVI (Time Series)", color: "#34D399" },
  { key: "VARI", title: "VARI (Time Series)", color: "#A78BFA" },
  { key: "NDWI", title: "VARI (Time Series)", color: "#b9f8cf" },
];


function transformApiData(raw: RawIndexData): IndexData[] {
  if (!raw || Object.keys(raw).length === 0) return [];

  // Get all unique dates across all indices
  const allDates = Array.from(
    new Set(
      Object.values(raw).flatMap(idx => Object.keys(idx))
    )
  ).sort();

  // Transform to array of objects
  const result: IndexData[] = allDates.map(dateStr => {
    const obj: IndexData = {
      date: `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`,
    };
    for (const key of Object.keys(raw)) {
      obj[key.toUpperCase()] = parseFloat(raw[key][dateStr] || "0");
    }
    return obj;
  });

  return result;
}

function convertRawDataToNamedArray(raw: Record<string, Record<string, string>>): NamedIndex[] {
  const result: NamedIndex[] = [];

  for (const key of Object.keys(raw)) {
    const innerObj = raw[key]; // raw[key] is already an object, not an array
    const values = Object.keys(innerObj).map(dateStr => ({
      date: `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`,
      value: innerObj[dateStr]
    }));
    result.push({ key: key, name: key, values });
  }

  return result;
}


export default function FarmIndexResults() {
  const {data,isOpen} = useSelector((state: RootState) => state.home);
  const [state, setState] = useState<any>();
  const [compareA, setCompareA] = useState<IndexKey>("NDVI");
  const [compareB, setCompareB] = useState<IndexKey>("NDWI");
  const [startDate, setStartDate] = useState<Date>(new Date(startDat));
  const [endDate, setEndDate] = useState<Date>(new Date(endDat));
  const [filteredData, setFilteredData] = useState<IndexData[]>([]);
  const [seriesChart, setSeriesChart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Initial API call
    handleApplyFilter();
    const onResize = () => drawMainChart(filteredData);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    drawMainChart(filteredData);
    const onResize = () => drawMainChart(filteredData);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compareA, compareB, filteredData, mounted]);


  const handleApplyFilter = async () => {
    setLoading(true);

    const formData = {
      startDate: startDate,
      endDate: endDate,
      ...data
    };

    try {
      const res = await fetch(`${API}/field/getAllIndexValues`, {
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
      const { data, fieldInfo, message } = dataValue;
      setState(fieldInfo)
      setFilteredData(transformApiData(data));
      setSeriesChart(convertRawDataToNamedArray(data))
    } catch (error: any) {
      console.error("Error submitting field:", error);
      // alert(error.message || "Unexpected error occurred");
    } 
    finally {
       setLoading(false);
    }
  };

  function handleReset() {
    setFilteredData([]);
    setStartDate(new Date(startDat));
    setEndDate(new Date(endDat));
  }

  function drawMainChart(data: IndexData[]) {
    if (!svgRef.current) return;
    const container = svgRef.current.parentElement;
    if (!container) return;

    const width = Math.max(400, container.clientWidth);
    const height = 340;
    const margin = { top: 34, right: 40, bottom: 60, left: 50 };

    const formattedData = data
      .map((d) => ({
        date: new Date(d.date),
        A: (d as any)[compareA] as number,
        B: (d as any)[compareB] as number,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // handle empty dataset gracefully
    if (!formattedData.length) {
      svg
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", "100%")
        .attr("height", height);

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", 14)
        .attr("fill", "#666")
        .text("No data for selected range");
      return;
    }

    const x = d3
      .scaleTime()
      .domain(d3.extent(formattedData, (d) => d.date) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const yMax = d3.max(formattedData, (d) => Math.max(d.A, d.B)) ?? 100;
    const y = d3
      .scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const colorA = indicesMeta.find((it) => it.value === compareA)?.color ?? "#ef4444";
    const colorB = indicesMeta.find((it) => it.value === compareB)?.color ?? "#3b82f6";

    const areaA = d3
      .area<{ date: Date; A: number; B: number }>()
      .x((d) => x(d.date))
      .y0(y(0))
      .y1((d) => y(d.A))
      .curve(d3.curveMonotoneX);

    const areaB = d3
      .area<{ date: Date; A: number; B: number }>()
      .x((d) => x(d.date))
      .y0(y(0))
      .y1((d) => y(d.B))
      .curve(d3.curveMonotoneX);

    const lineA = d3
      .line<{ date: Date; A: number; B: number }>()
      .x((d) => x(d.date))
      .y((d) => y(d.A))
      .curve(d3.curveMonotoneX);

    const lineB = d3
      .line<{ date: Date; A: number; B: number }>()
      .x((d) => x(d.date))
      .y((d) => y(d.B))
      .curve(d3.curveMonotoneX);

    // BASE SVG attrs
    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("width", "100%")
      .attr("height", height);

    // Title
    svg
      .append("text")
      .attr("x", margin.left)
      .attr("y", margin.top - 12)
      .attr("font-weight", 700)
      .attr("font-size", 14)
      .text("Indices (Time Series)");

    // Gridlines
    const yGrid = d3
      .axisLeft(y)
      .ticks(6)
      .tickSize(-width + margin.left + margin.right)
      .tickFormat(() => "" as any);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yGrid)
      .selectAll("line")
      .attr("stroke", "#e5e7eb");

    // --- Animated Areas (use per-element transitions) ---
    svg
      .append("path")
      .datum(formattedData)
      .attr("fill", hexWithOpacity(colorB, 0.25))
      .attr("d", areaB)
      .attr("opacity", 0)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicInOut)
      .attr("opacity", 1);

    svg
      .append("path")
      .datum(formattedData)
      .attr("fill", hexWithOpacity(colorA, 0.18))
      .attr("d", areaA)
      .attr("opacity", 0)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicInOut)
      .attr("opacity", 1);

    // --- Animated Lines (draw using stroke-dash technique) ---
    const pathB = svg
      .append("path")
      .datum(formattedData)
      .attr("fill", "none")
      .attr("stroke", colorB)
      .attr("stroke-width", 2)
      .attr("d", lineB);

    const pathBNode = pathB.node() as SVGPathElement | null;
    const pathBLen = pathBNode ? pathBNode.getTotalLength() : 0;
    pathB
      .attr("stroke-dasharray", pathBLen)
      .attr("stroke-dashoffset", pathBLen)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicInOut)
      .attr("stroke-dashoffset", 0);

    const pathA = svg
      .append("path")
      .datum(formattedData)
      .attr("fill", "none")
      .attr("stroke", colorA)
      .attr("stroke-width", 2)
      .attr("d", lineA);

    const pathANode = pathA.node() as SVGPathElement | null;
    const pathALen = pathANode ? pathANode.getTotalLength() : 0;
    pathA
      .attr("stroke-dasharray", pathALen)
      .attr("stroke-dashoffset", pathALen)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicInOut)
      .attr("stroke-dashoffset", 0);

    // Axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call((g) =>
    d3
      .axisBottom(x)
      .ticks(Math.min(6, formattedData.length))
      .tickFormat(d3.timeFormat("%b %d") as any)(g)
  )
      .selectAll("text")
      .style("font-size", "11px")
      .attr("dy", "0.5em");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(6))
      .selectAll("text")
      .style("font-size", "11px");

    // --- Dots with animation ---
    svg
      .selectAll(".dotA")
      .data(formattedData)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(0))
      .attr("r", 0)
      .attr("fill", colorA)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicInOut)
      .attr("cy", (d) => y(d.A))
      .attr("r", 4);

    svg
      .selectAll(".dotB")
      .data(formattedData)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(0))
      .attr("r", 0)
      .attr("fill", colorB)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicInOut)
      .attr("cy", (d) => y(d.B))
      .attr("r", 4);

    // --- Legend ---
    const legendItems = [
      { label: compareA, color: colorA },
      { label: compareB, color: colorB },
    ];
    const legendGroup = svg.append("g").attr("opacity", 0);
    const itemWidth = 120;
    const startX = (width - legendItems.length * itemWidth) / 2 + itemWidth / 2;
    const legendY = height - 18;

    legendItems.forEach((d, i) => {
      const g = legendGroup.append("g").attr("transform", `translate(${startX + i * itemWidth}, ${legendY})`);
      g.append("rect").attr("x", -10).attr("y", -10).attr("width", 10).attr("height", 10).attr("fill", d.color);
      g.append("text").text(d.label).attr("x", 6).attr("y", 0).attr("font-size", 13).attr("font-weight", 600).attr("fill", "#333");
    });
    legendGroup
      .transition()
      .duration(1200)
      .ease(d3.easeCubicInOut)
      .attr("opacity", 1);
  }

  function hexWithOpacity(hex: string, alpha = 0.2) {
    const c = hex.replace("#", "");
    const bigint = parseInt(
      c.length === 3 ? c.split("").map((ch) => ch + ch).join("") : c,
      16
    );
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }


  console.log("Series Chart Data:", seriesChart);

  return (
    <div className="p-6 space-y-6 w-full">
      {
        loading  ?  
        <Loader /> 
        :
        <>
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-xl font-semibold">
              Index Results{" "}
              <span className="text-gray-500 font-normal">{state && state.FieldDescription}</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              <Button className="px-7 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600">
                Download Index Results For This Field
              </Button>
              <Button className="px-7 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600">
                Download Index Results of All Fields
              </Button>
            </div>
          </div>

          {/* Date Range */}
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex items-center gap-2 flex-wrap">
              <label className="text-sm font-medium">Date Range:</label>
              <Calender
                value={startDate}
                onClick={(val) => val instanceof Date && setStartDate(val)}
                CalenderIcon="right"
                ChevronIcon={false}
                dateFormat="DD/MM/YYYY"
                btnClassName="min-w-[200px] justify-between rounded py-[10px]"
              />
              <span className="mx-1 text-gray-400">To</span>
              <Calender
                value={endDate}
                onClick={(val) => val instanceof Date && setEndDate(val)}
                CalenderIcon="right"
                ChevronIcon={false}
                dateFormat="DD/MM/YYYY"
                btnClassName="min-w-[200px] justify-between rounded py-[10px]"
              />
            </div>
            <Button onClick={handleApplyFilter} 
            className="px-6 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 cursor-pointer">
              Apply
            </Button>
            <Button onClick={handleReset} 
            className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer">
              Reset
            </Button>
          </div>

          {/* Chart */}
          <Card className="p-4 w-full">
            <div className="flex items-center justify-end gap-3 mb-4">
              <span className="font-medium">Compare To</span>
              <Select value={compareA} onValueChange={(v) => setCompareA(v as IndexKey)}>
                <SelectTrigger className="w-36 rounded">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {indicesMeta.map((i) => (
                    <SelectItem key={i.value} value={i.value}>
                      {i.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={compareB} onValueChange={(v) => setCompareB(v as IndexKey)}>
                <SelectTrigger className="w-36 rounded">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {indicesMeta.map((i) => (
                    <SelectItem key={i.value} value={i.value}>
                      {i.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="px-6 py-3 rounded-xl font-semibold bg-green-500 text-white hover:bg-green-600">
                Compare
              </Button>
            </div>
            <div className="w-full overflow-hidden">
              {mounted && <svg ref={svgRef} />}
            </div>
          </Card>

          {/* TimeSeriesChart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seriesChart.filter((v)=>v && v.name && filterIndexValues.includes(v.name))
            .sort((a, b) =>filterIndexValues.indexOf(a.name) - filterIndexValues.indexOf(b.name))
            .map((chart) => {
                const color =
                  filterIndexColor.find((f) => f.name === chart.name)?.color || "#999";
                return (
                  <TimeSeriesChart
                    key={chart.key}
                    title={chart.name.toUpperCase()+ " (Time Series)"}
                    label={chart.name.toUpperCase()}
                    data={chart.values}
                    color={color}
                  />
                );
              }
            )}
          </div>
        </>
      }
    
     {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chartConfigs.map((chart) => (
          <TimeSeriesChart
            key={chart.key}
            title={chart.title}
            label={chart.key}
            data={TimeSeriesChartData}
            color={chart.color}
          />
        ))}
     </div> */}
    </div>
  );
}
