import React, { useState, useEffect } from 'react'
import CollisionRisk from "../collisionRisk/collisionRisk";
import SeverityRisk from "../severityRisk/severityRisk";
import styles from "./panels.module.css";

// Delay in ms for closing one panel and opening the other
const PANEL_SWITCH_DELAY_MS: number = 140;

interface RiskPanelsProps {
  latitude: number;
  longitude: number;
  hood: string;
  mapRef: React.RefObject<mapboxgl.Map | null>;
  removeSelectedMarker: () => void;
  showNeighbourhoods: boolean;
  setShowNeighbourhoods: (show: boolean) => void;
}

export default function RiskPanels({
  latitude,
  longitude,
  hood,
  mapRef,
  removeSelectedMarker,
  showNeighbourhoods,
  setShowNeighbourhoods,
}: RiskPanelsProps) {
  const [showCollisionPanel, setShowCollisionPanel] = useState<boolean>(true);
  const [showSeverityPanel, setShowSeverityPanel] = useState<boolean>(false);

  const showPanelToggle = () => {
    //console.log("Toggled Collision Panel");
    if (showCollisionPanel){
      setShowCollisionPanel(false);
      return
    }
    setShowSeverityPanel(false)
  }

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

  return (
    <>
      <CollisionRisk 
        latitude={latitude}
        longitude={longitude}
        hood={hood}
        mapRef={mapRef}
        removeSelectedMarker={removeSelectedMarker}
        showCollisionPanel={showCollisionPanel}
      />
      <SeverityRisk neighbourhood={hood} showSeverityPanel={showSeverityPanel} />

      <div className={`container ${styles.switch}`}>
        <button onClick={showPanelToggle}>
          <img src="/switch.svg" alt="Switch Panel" />
        </button>     
      </div>     
    </>
  )
}
