"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import "leaflet-draw";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FarmerDetailModal from "./FarmerDetailModal";
// interface Suggestion {
//   display_name: string;
//   lat: string;
//   lon: string;
// }

function DrawTools({ setSelectedCoords, showInstruction, setShowInstruction }: any) {
  const map = useMap();
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
  const activeDrawerRef = useRef<any>(null);

  useEffect(() => {
    if (!map) return;
    const drawnItems = drawnItemsRef.current;
    map.addLayer(drawnItems);

    map.on(L.Draw.Event.CREATED, (e: any) => {
      drawnItems.addLayer(e.layer);
      console.log("GeoJSON:", e.layer.toGeoJSON());
      // Extract points
      const points = e.layer.toGeoJSON().geometry.coordinates[0];
      // points.pop(); // removes the last point
      // Check if it has at least three points
      setSelectedCoords(points);
      //
      setShowInstruction(false);
      activeDrawerRef.current = null;
    });
  }, [map, setShowInstruction]);

  const startPolygon = () => {
    if (!map) return;
    cancelActiveDrawer();
    activeDrawerRef.current = new L.Draw.Polygon(map as any);
    activeDrawerRef.current.enable();
    setShowInstruction(true);
  };

  const startCircle = () => {
    if (!map) return;
    cancelActiveDrawer();
    activeDrawerRef.current = new L.Draw.Circle(map as any);
    activeDrawerRef.current.enable();
    setShowInstruction(true);
  };

  const cancelActiveDrawer = () => {
    if (activeDrawerRef.current) {
      activeDrawerRef.current.disable();
      activeDrawerRef.current = null;
    }
  };

  const removeLastPoint = () => {
    const layers = drawnItemsRef.current.getLayers();
    if (layers.length > 0) {
      const lastLayer = layers[layers.length - 1];
      drawnItemsRef.current.removeLayer(lastLayer);
    }
  };

  const removeAllPoints = () => {
    drawnItemsRef.current.clearLayers();
  };

  return (
    <div className="absolute bottom-50 left-4 flex flex-col gap-2 z-[1000]">
      <Button 
        onClick={startPolygon} 
        className="
          bg-white/90 hover:bg-white text-gray-700 
          font-semibold cursor-pointer
          text-base sm:text-lg md:text-xl lg:text-xl
        p-6 sm:p-4 lg:p-6 rounded-4xl shadow-lg
          transition-all duration-300
        "
      >
        Draw Polygon
      </Button>

      {/* <button onClick={startCircle} className="map-btn">
        Draw Circular Field
      </button> */}
      <Button onClick={removeLastPoint} 
      className="bg-red-400 hover:bg-red-700 
        text-white font-semibold cursor-pointer
        text-base sm:text-lg md:text-xl lg:text-1xl
        p-6 sm:p-4 lg:p-6 rounded-4xl shadow-lg
      ">
        Remove Last Point
      </Button>
      <Button onClick={removeAllPoints} 
      className="bg-red-400 hover:bg-red-700 
        text-white font-semibold cursor-pointer
        text-base sm:text-lg md:text-xl lg:text-1xl
        p-6 sm:p-4 lg:p-6 rounded-4xl shadow-lg
      ">
        Remove All Points
      </Button>
      
    </div>
  );
}

export default function NewField() {
  const [showInstruction, setShowInstruction] = useState(false);
  const [mapType, setMapType] = useState("satellite");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<[number, number][]>([]);
  const [showFarmerModal, setShowFarmerModal] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  
  const fetchSuggestions = async (query: string) => {
    if (!query) return setSuggestions([]);
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`);
    const data = await res.json();
    setSuggestions(data);
  };


  return (
    <div className="relative h-[80vh] w-full rounded-2xl overflow-hidden" style={{ zIndex: 0 }}>
      {/* Top Bar */}
      <div className="absolute top-4 left-0 w-full z-[1000] flex items-center px-4">
        {/* Left side buttons */}
        <div className="flex gap-2">
          <Button
            className={`px-7 py-4 rounded-1xl font-semibold transition-all duration-300  min-w-[120px] text-[18px] cursor-pointer
              ${mapType === "map" 
              ? "bg-green-500 text-white shadow-md hover:bg-green-600" 
              : "bg-white text-gray-700 shadow-sm hover:bg-gray-100"}`}
            onClick={() => setMapType("map")}
          >
            Map
          </Button>
          <Button
            className={`px-7 py-4 rounded-1xl font-semibold transition-all duration-300  min-w-[120px] text-[18px] cursor-pointer
              ${mapType === "satellite" 
                ? "bg-green-500 text-white shadow-md hover:bg-green-600" 
                  : "bg-white text-gray-700 shadow-sm hover:bg-gray-100"}`}
              onClick={() => setMapType("satellite")}
            >
            Satellite
          </Button>
        </div>
        {/* Centered search input */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                fetchSuggestions(e.target.value);
              }}
              placeholder="🔍 Search Address"
              className="block px-4 py-2 rounded-4xl shadow outline-none bg-white min-w-[564px] min-h-[45px]"
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 w-[564px] sm:w-80 bg-white border rounded-lg shadow-lg z-[1100] max-h-64 overflow-auto">
                {suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchQuery(item.display_name);
                      setSuggestions([]);
                      const lat = parseFloat(item.lat);
                      const lon = parseFloat(item.lon);
                      mapRef.current?.flyTo([lat, lon], 15);
                    }}
                  >
                    {item.display_name}
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
      
      {/* Top Floating Controls */}
      <div className="absolute top-50 left-4 flex flex-col gap-2 z-[1000]">
        <Button onClick={() => alert("Back clicked")} 
         className="
          bg-white/90 hover:bg-white text-gray-700 
          cursor-pointer text-base 
          p-6 sm:p-4 lg:p-6 rounded-4xl shadow-lg
          transition-all duration-300
        ">
          Back To My Fields
        </Button>
        <Button onClick={() => alert("Upload KML clicked")} 
         className="
          bg-white/90 hover:bg-white text-gray-700 
          cursor-pointer text-base 
          p-6 sm:p-4 lg:p-6 rounded-4xl shadow-lg
          transition-all duration-300
        ">
          📂 Upload KML/SHP File
        </Button>
      </div>


      <MapContainer
        center={[23.824139, 90.427421]} // initial center
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
        <DrawTools
          setSelectedCoords={setSelectedCoords}
          showInstruction={showInstruction}
          setShowInstruction={setShowInstruction}
        />
      </MapContainer>

      {/* {showInstruction && ( */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-[#ffffffbd] px-8 py-6 rounded-2xl shadow 
        text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[30px] text-800 font-medium z-[1000]"
        >
          Click on the map to add points or draw a polygon.
        </div>
      {/* )} */}

      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-[1000] w-full flex justify-center px-4">
        <Button
           onClick={() => {
            if (selectedCoords.length >= 3) {
               setShowFarmerModal(true)
              console.log("Valid polygon with points:", selectedCoords);
            } else {
              console.log(selectedCoords)
              alert("Please select at least 3 points on the map.");
            }
           }}
          className="
            bg-green-500 hover:bg-green-600 
            text-white font-semibold cursor-pointer
            text-sm sm:text-base md:text-lg lg:text-xl xl:text-1xl
            p-8 sm:p-4 lg:p-8
            rounded-4xl shadow-lg
            w-full max-w-[90%] sm:max-w-[400px] lg:max-w-[500px]
            transition-all duration-300
          "
        >
          Submit For Pre-Processing
        </Button>
      </div>
      {showFarmerModal && selectedCoords.length >= 3 && (
        <FarmerDetailModal
          isOpen={showFarmerModal}
          onClose={() => setShowFarmerModal(false)}
          selectedCoords={selectedCoords}
        />
      )}
    </div>
  );
}
