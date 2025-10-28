"use client";
import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import CollisionRisk from "./collisionRisk";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
//https://www.w3schools.com/howto/howto_js_collapse_sidepanel.asp

const INITIAL_CENTER: [number, number] = [-79.3662, 43.715];//long, lat
const INITIAL_ZOOM: number = 10.5;

const MAP_BOUNDS: [[number, number], [number, number]] = [
  [-79.8298827685777, 43.5], // Southwest coordinates
  [-78.90154616803314, 43.92], // Northeast coordinates
];

export default function Home() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER);
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);
  
  const [latitude, setLatitude] = useState<number>(INITIAL_CENTER[1]);
  const [longitude, setLongitude] = useState<number>(INITIAL_CENTER[0]);

  const [currRiskScore, setCurrRiskScore] = useState<number>(0.0);
  const [currPrediction, setCurrPrediction] = useState<string>("NA");

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

    mapRef.current.on("click", (e: mapboxgl.MapMouseEvent) => {
      handleMapClick(e, map);
    });

    mapRef.current.on("move", () => {
      const mapCenter = map.getCenter();
      const mapZoom = map.getZoom();
      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
    });

    return () => mapRef.current?.remove();
  }, []);

  const handleMapClick = (e: mapboxgl.MapMouseEvent, map: mapboxgl.Map) => {
    const { lat, lng } = e.lngLat;
    setLatitude(lat);
    setLongitude(lng);
  };

  return (
    <>
      <div id="map-container" ref={mapContainerRef} />
      <div className="temp">
        <h3>Collision Risk Score: {currRiskScore}</h3>
        <h3>Collision Risk Class: {currPrediction}</h3>
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} |
        Zoom: {zoom.toFixed(2)}
      </div>
      <CollisionRisk 
        latitude={latitude}
        longitude={longitude}
        onLatitudeChange={(value: number) => setLatitude(value)}
        onLongitudeChange={(value: number) => setLongitude(value)}
        mapRef={mapRef}
        onPredictionUpdate={(prediction: string, score: number) => {
          setCurrPrediction(prediction);
          setCurrRiskScore(score);
        }}
       />
    </> 
  );
}
