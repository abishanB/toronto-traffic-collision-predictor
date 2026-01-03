"use client";
import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import RiskPanels from "./riskPanels/riskPanels";
import MapLayers from "./mapLayers/mapLayers";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

const INITIAL_CENTER: [number, number] = [-79.3662, 43.715];//long, lat
const INITIAL_ZOOM: number = 10.5;

const MAP_BOUNDS: [[number, number], [number, number]] = [
  [-79.8298827685777, 43.5], // Southwest coordinates
  [-78.90154616803314, 43.92], // Northeast coordinates
];

export default function Home() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER);//camera center
  const [mousePos, setMousePos] = useState<[number, number]>(INITIAL_CENTER);
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);
  
  const [showNeighbourhoods, setShowNeighbourhoods] = useState<boolean>(false);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    const container = mapContainerRef.current;
    if (!container) return; // ensures it's not null
    
    const map = new mapboxgl.Map({
      container: container,
      style: "mapbox://styles/mapbox/streets-v11", // required
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      maxBounds: MAP_BOUNDS
    });
    mapRef.current = map; // assign to ref once created

    if (!mapRef.current) return;

    mapRef.current.on("move", () => {
      const mapCenter = map.getCenter();
      const mapZoom = map.getZoom();
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });

    map.on("mousemove", (e) => {
      const { lng, lat } = e.lngLat;
      setMousePos([lng, lat]);
    });

    return () => mapRef.current?.remove();
  }, []);

  return (
    <>
      <div id="map-container" ref={mapContainerRef} />
      <div className="map-status">
        Longitude: {mousePos[0].toFixed(4)} | Latitude: {mousePos[1].toFixed(4)} |
        Zoom: {zoom.toFixed(2)}
      </div>
    
      <MapLayers mapRef={mapRef} />
      
      <RiskPanels mapRef={mapRef}/>
    </> 
  );
}
