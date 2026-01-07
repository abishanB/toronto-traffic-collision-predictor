import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

interface NeighbourhoodLayersProps {
  map: mapboxgl.Map | null;
  showNeighbourhoods: boolean;
}

const NeighbourhoodLayers = ({ map, showNeighbourhoods }: NeighbourhoodLayersProps) => {
  const popupRef = useRef<mapboxgl.Popup | null>(null);

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
            layout: {visibility: "none"},
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
               visibility: "none",
            },
            paint: {
              "line-color": "#088",
              "line-width": 2,
            },
          });

          // Create popup for hover
          if (!popupRef.current) {
            popupRef.current = new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
            });
          }

          // Handle mousemove on neighbourhoods fill layer
          map.on("mousemove", "neighbourhoods-fill", (e) => {
            map.getCanvas().style.cursor = "pointer";
            if (e.features && e.features.length > 0) {
              const feature = e.features[0];
              const properties = feature.properties;
              let neighbourhoodName = "Unknown";
              if (properties) {
               neighbourhoodName = properties.name || properties.AREA_NAME || "Unknown";
              }
              const coordinates = (e.lngLat);
              popupRef.current?.setLngLat(coordinates)
                .setHTML(`
                  <div class='neighbourhood-popup'>
                  ${neighbourhoodName}
                  </div>`)
                .addTo(map);
            }
          });

          map.on("mouseleave", "neighbourhoods-fill", () => {
            map.getCanvas().style.cursor = "";
            popupRef.current?.remove();
          });
        }
      })
      .catch((error) => console.error("Error loading GeoJSON:", error));

    return () => {
      // Cleanup event listeners
      if (map && map.getLayer("neighbourhoods-fill")) {
        // @ts-expect-error - TypeScript issue with off method
        map.off("mousemove", "neighbourhoods-fill");
        // @ts-expect-error - TypeScript issue with off method
        map.off("mouseleave", "neighbourhoods-fill");
      }
      popupRef.current?.remove();
    };
  }, [map]);

  // Handle visibility toggle
  useEffect(() => {
    if (!map) return;

    if (!map.getLayer("neighbourhoods-fill")) return;
    if (!map.getLayer("neighbourhoods-outline")) return;

    const visibility = showNeighbourhoods ? "visible" : "none";

    map.setLayoutProperty("neighbourhoods-fill", "visibility", visibility);
    map.setLayoutProperty("neighbourhoods-outline", "visibility", visibility);
  }, [showNeighbourhoods, map]);

  return null;
};

export default NeighbourhoodLayers;
