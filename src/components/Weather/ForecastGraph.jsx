"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function ForecastGraph({ data, yKey, label, color }) {
  const ref = useRef();

  useEffect(() => {
    if (!data || !ref.current) return;

    // Responsive margins
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const height = 350;

    const containerWidth = ref.current.clientWidth;

    const width = containerWidth - margin.left - margin.right;

    const svg = d3
      .select(ref.current)
      .html("")
      .append("svg")
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", `0 0 ${containerWidth} ${height}`)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const parseTime = d3.timeParse("%s");

    // X scale
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => parseTime(d.dt)))
      .range([0, width]);

    // Y scale with fixed domain per metric
    let yDomain;
    if (yKey === "humidity") yDomain = [0, 100];
    else if (yKey === "clouds") yDomain = [0, 150];
    else if (yKey === "pressure") yDomain = [1000, 1014];
    else yDomain = [0, d3.max(data, d => d[yKey])];

    const y = d3.scaleLinear()
      .domain(yDomain)
      .nice()
      .range([height - margin.top - margin.bottom, 0]);

    // Line generator
    const line = d3.line()
      .x(d => x(parseTime(d.dt)))
      .y(d => y(d[yKey]))
      .curve(d3.curveMonotoneX);

    // Area under line
    const area = d3.area()
      .x(d => x(parseTime(d.dt)))
      .y0(height - margin.top - margin.bottom)
      .y1(d => y(d[yKey]))
      .curve(d3.curveMonotoneX);

    // Area
    svg.append("path")
      .datum(data)
      .attr("fill", color + "20")
      .attr("d", area);

    // Line path
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", line);

    // X Axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat("%b %d")));

    // Y Axis without top line
    svg.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .call(g => g.select(".domain").remove());

    // Horizontal grid lines
    svg.append("g")
      .call(d3.axisLeft(y)
        .ticks(5)
        .tickSize(-width)
        .tickFormat("")
      )
      .selectAll("line")
      .attr("stroke", "#e0e0e0")
      .attr("stroke-dasharray", "3,3");

    // Dots
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(parseTime(d.dt)))
      .attr("cy", d => y(d[yKey]))
      .attr("r", 4)
      .attr("fill", color);

    // Label
    svg.append("text")
      .attr("x", width)
      .attr("y", -5)
      .attr("text-anchor", "end")
      .attr("fill", color)
      .style("font-weight", "600")
      .text(label);

    // Vertical hover line
    const hoverLine = svg.append("line")
      .attr("stroke", "#aaa")
      .attr("stroke-width", 1)
      .attr("y1", 0)
      .attr("y2", height - margin.top - margin.bottom)
      .style("opacity", 0);

    svg.append("rect")
      .attr("width", width)
      .attr("height", height - margin.top - margin.bottom)
      .attr("fill", "transparent")
      .on("mousemove", function(event) {
        const [mx] = d3.pointer(event);
        hoverLine
          .attr("x1", mx)
          .attr("x2", mx)
          .style("opacity", 1);
      })
      .on("mouseout", () => hoverLine.style("opacity", 0));

  }, [data, yKey, color, label]);

  return <div ref={ref} className="w-full"></div>;
}
