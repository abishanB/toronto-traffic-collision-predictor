import { useEffect } from "react";

interface NeighbourhoodLayersProps {
  map: mapboxgl.Map | null;
  showNeighbourhoods: boolean;
}

const NeighbourhoodLayers = ({ map, showNeighbourhoods }: NeighbourhoodLayersProps) => {
  useEffect(() => {
    if (!map) return;

    // Load the GeoJSON data
    fetch("/toronto_neigbourhoods.geojson")
      .then((response) => response.json())
      .then((data) => {
        // Check if the source already exists
        if (!map.getSource("neighbourhoods")) {
          // Add the GeoJSON source
          map.addSource("neighbourhoods", {
            type: "geojson",
            data: data,
          });

          // Add the fill layer
          map.addLayer({
            id: "neighbourhoods-fill",
            type: "fill",
            source: "neighbourhoods",
            layout: {},
            paint: {
              "fill-color": "#088",
              "fill-opacity": 0.2,
            },
          });

          // Add the outline layer
          map.addLayer({
            id: "neighbourhoods-outline",
            type: "line",
            source: "neighbourhoods",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#088",
              "line-width": 2,
            },
          });
        }
      })
      .catch((error) => console.error("Error loading GeoJSON:", error));

    return () => {
      // Cleanup is handled by Mapbox when component unmounts
    };
  }, [map]);

  // Handle visibility toggle
  useEffect(() => {
    if (!map) return;

    try {
      if (showNeighbourhoods) {
        map.setLayoutProperty("neighbourhoods-fill", "visibility", "visible");
        map.setLayoutProperty("neighbourhoods-outline", "visibility", "visible");
      } else {
        map.setLayoutProperty("neighbourhoods-fill", "visibility", "none");
        map.setLayoutProperty("neighbourhoods-outline", "visibility", "none");
      }
    } catch (error) {
      console.error("Error toggling neighbourhood visibility:", error);
    }
  }, [showNeighbourhoods, map]);

  return null;
};

export default NeighbourhoodLayers;
