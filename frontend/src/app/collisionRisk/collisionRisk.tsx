import styles from "./collisionRisk.module.css"
import mapboxgl from 'mapbox-gl';
import { useState } from "react";
import { fetchKernalDensityPrediction } from '../fetchPredictions';

interface CollisionRiskProps {
  latitude: number;
  longitude: number;
  hood: string;
  mapRef: React.RefObject<mapboxgl.Map | null>;
  onPredictionUpdate: (prediction: string, score: number) => void;
}

export default function CollisionRisk({
  latitude,
  longitude,
  hood,
  mapRef,
  onPredictionUpdate
}: CollisionRiskProps) {
  const inputStep: number = 0.001;// step size for lat and long fields
  const [errorMsg, setErrorMsg] = useState<string>(' ');

  const handlePredict = async () => {
    if (!mapRef.current) return;
    if (hood === 'Unknown') {
      setErrorMsg('Invalid Coordinates');
      return;
    }
    if (!isFinite(latitude) || !isFinite(longitude)) {
      setErrorMsg('Please enter valid coordinates');
      return;
    }
    setErrorMsg('');

    const prediction = await fetchKernalDensityPrediction(latitude, longitude);
    onPredictionUpdate(prediction.collision_risk_class, prediction.collision_risk_score);

    // Create and add marker
    const marker_div: Element = document.createElement("div");
    marker_div.className = "marker";
    const colorMap: Record<string, string> = {
      "Low Risk": "low",
      "Medium Risk": "medium",
      "High Risk": "high",
    };
    marker_div.className = "marker " + colorMap[prediction.collision_risk_class];
    
    new mapboxgl.Marker(marker_div)
      .setLngLat([longitude, latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h3>${latitude}</h3><p>${longitude}</p>`)
      )
      .addTo(mapRef.current);
  };

  return (
    <div className={`container ${styles.collisionRisk}`}>
      <h4>Collision Risk</h4>
      <div className={styles.latLongGroup}>
        <div className={styles['input-group']}>
          <label htmlFor="latitude">Latitude:</label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            value={latitude.toFixed(6)}
            step={inputStep}
            placeholder="Enter latitude"
            readOnly
          />
        </div>
        <div className={styles['input-group']}>
          <label htmlFor="longitude">Longitude:</label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            value={longitude.toFixed(6)}
            step={inputStep}
            placeholder="Enter longitude"
            readOnly
          />
        </div>
      </div>
      <p className={styles.errorMsg}>{errorMsg}</p>
       <button 
          className='predict-button'
          onClick={handlePredict}
        >
          Predict Collision Risk
        </button>
    </div>
  )
}
