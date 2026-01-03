import { useEffect } from "react";

interface CollisonHeatmapProps {
  map: mapboxgl.Map | null;
  showHeatmap: boolean;
}

//url to the mapbox tileset containing collision points
const COLLISION_POINTS_URL = "mapbox://abishanbhavananthan.2hmqzk9w";

const CollisonHeatmap = ({ map, showHeatmap }: CollisonHeatmapProps) => {
  useEffect(() => {
    if (!map) return;

    const addHeatmapLayers = () => {
      if (map.getSource("collisions")) return;

      map.addSource("collisions", {
        type: "vector",
        url: COLLISION_POINTS_URL,
      });

      map.addLayer({
        id: "collisions-heat",
        type: "heatmap",
        source: "collisions",
        "source-layer": "collisions",
        layout: { visibility: "none" },
        maxzoom: 16,
        paint: {
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0, 1,
            10, 1.2,
            12, 1.5,
            
          ],
          "heatmap-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0, 1,
            10, 10
          ],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0.00, "rgba(33,102,172,0)",
            0.10, "rgb(103,169,207)",
            0.25, "rgb(209,229,240)",
            0.45, "rgb(253,219,199)",
            0.70, "rgb(239,138,98)",
            1.00, "rgb(178,24,43)"
          ],
          "heatmap-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            7, 1,
            16, 0
          ],
        },
      });

      map.addLayer({
        id: "collisions-point",
        type: "circle",
        source: "collisions",
        "source-layer": "collisions",
        minzoom: 15,
        layout: { visibility: "none" },
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            14, 3,
            18, 6
          ],
          "circle-color": "rgba(178, 24, 43, 0.7)",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 1
        }
      });
    };

    if (map.isStyleLoaded()) {
      addHeatmapLayers();
    } else {
      map.once("load", addHeatmapLayers);
    }
  }, [map]);

  useEffect(() => {
    if (!map) return;

    const visibility = showHeatmap ? "visible" : "none";

    if (map.getLayer("collisions-heat")) {
      map.setLayoutProperty("collisions-heat", "visibility", visibility);
    }

    if (map.getLayer("collisions-point")) {
      map.setLayoutProperty("collisions-point", "visibility", visibility);
    }
  }, [map, showHeatmap]);

  return null;
};

export default CollisonHeatmap;