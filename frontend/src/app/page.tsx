"use client";
import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import RiskPanels from "./ui_panels/riskPanels";
import NeighbourhoodLayers from "./NeighbourhoodLayers";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import { fetchHood } from './fetchPredictions';

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
  
  const selectedMarkerRef = useRef<mapboxgl.Marker | null>(null);// ref to store the selected position marker
  const [latitude, setLatitude] = useState<number>(INITIAL_CENTER[1]);
  const [longitude, setLongitude] = useState<number>(INITIAL_CENTER[0]);

  const [currHood, setCurrHood] = useState<string>("");
  const [showNeighbourhoods, setShowNeighbourhoods] = useState<boolean>(true);

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
    
    mapRef.current.on("click", (e: mapboxgl.MapMouseEvent) => {
      handleMapClick(e);
    });

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

  const removeSelectedMarker = (): void => { 
    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.remove();
      selectedMarkerRef.current = null;
    }
  }

  const updateSelectedMarker = (lng: number, lat: number): void => {
    removeSelectedMarker();

    const selected_postion_marker: Element = document.createElement("div");
    selected_postion_marker.className = "selected " + "marker";
    if (mapRef.current) {
      selectedMarkerRef.current = new mapboxgl.Marker(selected_postion_marker)
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 }))
        .addTo(mapRef.current);
    } 
  };
  
  const handleMapClick = async(e: mapboxgl.MapMouseEvent) => {
    //ignore clicks on existing markers or popups
    const target = e.originalEvent.target as HTMLElement;
    if (target.closest(".mapboxgl-marker") || target.closest(".mapboxgl-popup")) {
      return;
    }
    
    let { lat, lng } = e.lngLat;
    setLatitude(lat);
    setLongitude(lng);
    
    let hood = await fetchHood(lat, lng)
    setCurrHood(hood.neighbourhood_name);
    
    updateSelectedMarker(lng, lat);
  };

  return (
    <>
      <div id="map-container" ref={mapContainerRef} />
      <NeighbourhoodLayers map={mapRef.current} showNeighbourhoods={showNeighbourhoods} />
      <div className="temp">
        {/* <h3>Collision Risk Score: {currRiskScore}</h3>
        <h3>Collision Risk Class: {currPrediction}</h3>
        <h3>Current Hood: {currHood}</h3> */}
        Longitude: {mousePos[0].toFixed(4)} | Latitude: {mousePos[1].toFixed(4)} |
        Zoom: {zoom.toFixed(2)}
      </div>
      <div className={'container neighbourhood-toggle'}>
        <label htmlFor="neighbourhood-toggle" className='toggle-label'>
          Show Neighbourhoods
        </label>
        <input
          id="neighbourhood-toggle"
          type="checkbox"
          checked={showNeighbourhoods}
          onChange={(e) => setShowNeighbourhoods(e.target.checked)}
          className='toggle-checkbox'
        />
      </div>

      <RiskPanels 
        latitude={latitude}
        longitude={longitude}
        hood={currHood}
        mapRef={mapRef}
        removeSelectedMarker={removeSelectedMarker}
        showNeighbourhoods={showNeighbourhoods}
        setShowNeighbourhoods={setShowNeighbourhoods}
      />
    </> 
  );
}
