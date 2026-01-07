import { useState } from "react";
import NeighbourhoodLayers from "./neighbourhoods";
import CollisonHeatmap from "./collisonHeatmap";
import "./mapLayers.css"

interface MapLayersProps {
  mapRef: React.RefObject<mapboxgl.Map | null>;
}

export default function MapLayers({mapRef}: MapLayersProps) {
  const [showNeighbourhoods, setShowNeighbourhoods] = useState<boolean>(false);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);

  return (
    <>
      <CollisonHeatmap map={mapRef.current} showHeatmap={showHeatmap} />
      <NeighbourhoodLayers map={mapRef.current} showNeighbourhoods={showNeighbourhoods} />
      
      <div id="neighbourhood-toggle" className={'container toggle'}>
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

      <div id="heatmap-toggle" className={'container toggle'}>
        <label htmlFor="heatmap-toggle" className='toggle-label'>
          Show Heatmap
        </label>
        <input
          id="heatmap-toggle"
          type="checkbox"
          checked={showHeatmap}
          onChange={(e) => setShowHeatmap(e.target.checked)}
          className='toggle-checkbox'
        />
      </div>
    </>
  )
}
