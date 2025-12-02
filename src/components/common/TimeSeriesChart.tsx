"use client";
import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

interface TimeSeriesChartProps {
  title: string;
  label: string;
  data: { date: string; value: number }[];
  color?: string;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  title,
  label,
  data,
  color = "#4F46E5", // default indigo
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
  if (!svgRef.current || !data?.length) return;

  const svg = d3.select(svgRef.current);
  svg.selectAll("*").remove();

  // Dimensions
  const container = svgRef.current.parentElement;
  const width = container ? container.clientWidth : 400;
  const height = 340;
  const margin = { top: 40, right: 30, bottom: 50, left: 50 };

  // Scales
  const x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => new Date(d.date)) as [Date, Date])
    .range([margin.left, width - margin.right]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)! * 1.1])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Line generator
  const line = d3
    .line<{ date: string; value: number }>()
    .x((d) => x(new Date(d.date)))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX);

  // Area generator
  const area = d3
    .area<{ date: string; value: number }>()
    .x((d) => x(new Date(d.date)))
    .y0(height - margin.bottom)
    .y1((d) => y(d.value))
    .curve(d3.curveMonotoneX);

  // Gradient fill
  const gradientId = `gradient-${label}`;
  const defs = svg.append("defs");
  const gradient = defs
    .append("linearGradient")
    .attr("id", gradientId)
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");
  gradient
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", color)
    .attr("stop-opacity", 0.3);
  gradient
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", color)
    .attr("stop-opacity", 0);

  // === Gridlines ===
  // Horizontal (Y-axis)
  const yGrid = d3
    .axisLeft(y)
    .ticks(6)
    .tickSize(-width + margin.left + margin.right)
    .tickFormat(() => "" as any);

  svg
    .append("g")
    .attr("class", "y-grid")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yGrid)
    .selectAll("line")
    .attr("stroke", "#e5e7eb");

  // Vertical (X-axis)
  const xGrid = d3
    .axisBottom(x)
    .ticks(6)
    .tickSize(-height + margin.top + margin.bottom)
    .tickFormat(() => "" as any);

  svg
    .append("g")
    .attr("class", "x-grid")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xGrid)
    .selectAll("line")
    .attr("stroke", "#e5e7eb");

  // === Axes ===
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(6)
        .tickFormat(d3.timeFormat("%b %d %Y") as any)
    )
    .selectAll("text")
    .style("font-size", "11px");

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(6))
    .selectAll("text")
    .style("font-size", "11px");

  // === Area ===
  svg
    .append("path")
    .datum(data)
    .attr("fill", `url(#${gradientId})`)
    .attr("d", area);

  // === Line ===
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", 2.5)
    .attr("d", line);

  // === Points ===
  svg
    .selectAll(".point")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "point")
    .attr("cx", (d) => x(new Date(d.date)))
    .attr("cy", (d) => y(d.value))
    .attr("r", 4)
    .attr("fill", color);

  // === Title ===
  svg
    .append("text")
    .attr("x", margin.left)
    .attr("y", margin.top - 15)
    .attr("font-size", "14px")
    .attr("font-weight", "bold")
    .text(`${title}`);

  // === Label under chart ===
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .attr("fill", color)
    .text(label);
}, [data, color, label, title]);


  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm">
      <svg ref={svgRef} width="100%" height="340"></svg>
    </div>
  );
};

export default TimeSeriesChart;
