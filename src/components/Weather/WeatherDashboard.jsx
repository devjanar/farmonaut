"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WeatherSummary from "./WeatherSummary";
import WeatherCard from "./WeatherCard";
import ForecastGraph from "./ForecastGraph";

export default function WeatherDashboard({ data }) {
  const { current, daily, hourly, location, lat, lon } = data;
  console.log("Location Data:", current, location);
  return (
    <>
     <h2 className="text-xl font-semibold mb-2">Test Field</h2>
    <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left Section */}
      <div className="space-y-4">
        <WeatherSummary current={current} location={location} lat={lat} lon={lon}/>
        <Tabs defaultValue="daily" className="w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-2xl">
          <TabsList className="w-full">
            <TabsTrigger value="daily">
              Daily (8 Days)
            </TabsTrigger>
            <TabsTrigger value="hourly">
              Hourly (2 Days)
            </TabsTrigger>
          </TabsList>
          <TabsContent value="daily">
            {daily.slice(0, 8).filter((_, index) => index < 8).map((d, i) => (
              <WeatherCard key={i} item={d} />
            ))}
          </TabsContent>
          <TabsContent value="hourly">
            {hourly.slice(0, 48).filter((_, index) => index < 16).map((h, i) => (
              <WeatherCard key={i} item={h} />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border p-4">

        <Tabs defaultValue="daily" className="w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-2xl">
          <TabsList className="w-full">
            <TabsTrigger value="daily">
              Forecast Graphs
            </TabsTrigger>
            <TabsTrigger value="hourly">
              Historical Graphs
            </TabsTrigger>
            <button className="bg-teal-600 text-white px-4 py-1 rounded-md hover:bg-teal-700 cursor-pointer">
              Download Data
            </button>
          </TabsList>
          <TabsContent value="daily">
             <div className="mt-6 space-y-6">
              <ForecastGraph data={daily} yKey="humidity" label="Humidity" color="#ef4444" />
              <ForecastGraph data={daily} yKey="clouds" label="Cloud Cover" color="#ef4444" />
              <ForecastGraph data={daily} yKey="pressure" label="Pressure" color="#ef4444" />
              <ForecastGraph data={daily} yKey="wind_speed" label="Wind Speed" color="#ef4444" />
            </div>
          </TabsContent>
          <TabsContent value="hourly">
             <div className="mt-6 space-y-6">
              <ForecastGraph data={hourly} yKey="humidity" label="Humidity" color="#ef4444" />
              <ForecastGraph data={hourly} yKey="clouds" label="Cloud Cover" color="#ef4444" />
              <ForecastGraph data={hourly} yKey="pressure" label="Pressure" color="#ef4444" />
              <ForecastGraph data={hourly} yKey="wind_speed" label="Wind Speed" color="#ef4444" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </>
  );
}
