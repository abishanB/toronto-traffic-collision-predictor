import React, { useState, useEffect, useRef } from 'react'
import mapboxgl from "mapbox-gl";
import CollisionRisk from "../collisionRisk/collisionRisk";
import SeverityRisk from "../severityRisk/severityRisk";
import "./panels.css";
import { fetchHood } from './fetchNeighbourhood';
// Delay in ms for closing one panel and opening the other
const PANEL_SWITCH_DELAY_MS: number = 140;

interface RiskPanelsProps {
  mapRef: React.RefObject<mapboxgl.Map | null>;
}

export default function RiskPanels({
  mapRef,
}: RiskPanelsProps) {
  const [showCollisionPanel, setShowCollisionPanel] = useState<boolean>(true);
  const [showSeverityPanel, setShowSeverityPanel] = useState<boolean>(false);

  const [latitude, setLatitude] = useState<number>(43.715);//random coords in Toronto
  const [longitude, setLongitude] = useState<number>(-79.3662);
  const [currHood, setCurrHood] = useState<string>("");

  const selectedMarkerRef = useRef<mapboxgl.Marker | null>(null);// ref to store the selected position marker
  
  const [animateSwitchIcon, setAnimateSwitchIcon] = useState<boolean>(false);

  const showPanelToggle = () => {
    setAnimateSwitchIcon(!animateSwitchIcon)
    //console.log("Toggled Collision Panel");
    if (showCollisionPanel){
      setShowCollisionPanel(false);
      return
    }
    setShowSeverityPanel(false)
  }

  const handleMapClick = async(e: mapboxgl.MapMouseEvent) => {
    const target = e.originalEvent.target as HTMLElement;
    if (target.closest(".mapboxgl-marker") || target.closest(".mapboxgl-popup")) {
      //ignore clicks on existing markers or popups
      return;
    }
    
    const { lat, lng } = e.lngLat;
    setLatitude(lat);
    setLongitude(lng);
    
    const hood = await fetchHood(lat, lng)
    setCurrHood(hood.neighbourhood_name);
    
    updateSelectedMarker(lng, lat);
  };

  useEffect(() => {//set up map click listener
    const map = mapRef.current;
    if (!map) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => handleMapClick(e);
    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [handleMapClick, mapRef]);

  useEffect(() => {
    if (!showCollisionPanel && !showSeverityPanel){
      setTimeout(() => {
        setShowSeverityPanel(true);
      }, PANEL_SWITCH_DELAY_MS)
    }
  }, [showCollisionPanel]);

  useEffect(() => {
    if (!showCollisionPanel && !showSeverityPanel){
      setTimeout(() => {
        setShowCollisionPanel(true);
      }, PANEL_SWITCH_DELAY_MS)
    }
  }, [showSeverityPanel]);

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
  return (
    <>
      <CollisionRisk 
        latitude={latitude}
        longitude={longitude}
        hood={currHood}
        mapRef={mapRef}
        removeSelectedMarker={removeSelectedMarker}
        showCollisionPanel={showCollisionPanel}
      />
      <SeverityRisk neighbourhood={currHood} showSeverityPanel={showSeverityPanel} />

      <div className={`container switch ${animateSwitchIcon ? "active" : ""}`}>
        <button onClick={showPanelToggle}>
          <img src="/switch.svg" alt="Switch Panel" />
        </button>     
      </div>     
    </>
  )
}
