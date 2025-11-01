import { useState, useEffect } from 'react';
import styles from './severityRisk.module.css';
import { fetchSeverityRisk } from '../fetchPredictions';
interface FormData {
  light_condition: string;
  visibility: string;
  road_condition: string;
  dow: string;
  time_of_day: string;
  season: string;
  vehicle_type: string;
  driver_action: string;
  impact_type: string;
  age_range: string;
  neighbourhood: string;
}

interface SeverityRiskProps {
  neighbourhood: string;
}

export default function SeverityRisk({ neighbourhood }: SeverityRiskProps) {
  const [formData, setFormData] = useState<FormData>({
    light_condition: '',
    visibility: '',
    road_condition: '',
    dow: '',
    time_of_day: '',
    season: '',
    vehicle_type: '',
    driver_action: '',
    impact_type: '',
    age_range: '',
    neighbourhood: neighbourhood
  });
  const [prediction, setPrediction] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update formData when neighbourhood prop changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      neighbourhood: neighbourhood
    }));
  }, [neighbourhood]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prediction = await fetchSeverityRisk(formData);
    setPrediction(prediction.severity_risk_class);
  };

  return (
    <div className={`container ${styles.severityRisk}`}>
      <h4>Severity Risk Assessment</h4>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label className={styles.label} htmlFor="neighbourhood">
            Neighbourhood
          </label>
          <input
            type="text"
            id="neighbourhood"
            name="neighbourhood"
            className={styles.select}
            value={formData.neighbourhood}
            readOnly
            disabled
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="light_condition">
            Light Condition
          </label>
          <select
            id="light_condition"
            name="light_condition"
            className={styles.select}
            value={formData.light_condition}
            onChange={handleChange}
          >
            <option value="">Select light condition</option>
            <option value="Daylight">Daylight</option>
            <option value="Twilight">Twilight</option>
            <option value="Dark">Dark</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="visibility">
            Visibility
          </label>
          <select
            id="visibility"
            name="visibility"
            className={styles.select}
            value={formData.visibility}
            onChange={handleChange}
          >
            <option value="">Select visibility</option>
            <option value="Clear">Clear</option>
            <option value="Rain">Rain</option>
            <option value="Snow">Snow</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="road_condition">
            Road Condition
          </label>
          <select
            id="road_condition"
            name="road_condition"
            className={styles.select}
            value={formData.road_condition}
            onChange={handleChange}
          >
            <option value="">Select road condition</option>
            <option value="Dry">Dry</option>
            <option value="Wet">Wet</option>
            <option value="SnowIce">Snow/Ice</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="time_of_day">
            Time of Day
          </label>
          <select
            id="time_of_day"
            name="time_of_day"
            className={styles.select}
            value={formData.time_of_day}
            onChange={handleChange}
          >
            <option value="">Select time of day</option>
            <option value="Night">Night</option>
            <option value="LateNight">Late Night</option>
            <option value="MorningAfternoon">Morning/Afternoon</option>
            <option value="Evening">Evening</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="dow">
            Day of Week
          </label>
          <select
            id="dow"
            name="dow"
            className={styles.select}
            value={formData.dow}
            onChange={handleChange}
          >
            <option value="">Select day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="season">
            Season
          </label>
          <select
            id="season"
            name="season"
            className={styles.select}
            value={formData.season}
            onChange={handleChange}
          >
            <option value="">Select season</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Fall">Fall</option>
            <option value="Winter">Winter</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="vehicle_type">
            Vehicle Type
          </label>
          <select
            id="vehicle_type"
            name="vehicle_type"
            className={styles.select}
            value={formData.vehicle_type}
            onChange={handleChange}
          >
            <option value="">Select vehicle type</option>
            <option value="Bus">Bus</option>
            <option value="Two Wheeler">Two Wheeler</option>
            <option value="Car">Car</option>
            <option value="Emergency">Emergency</option>
            <option value="Truck">Truck</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="driver_action">
            Driver Action
          </label>
          <select
            id="driver_action"
            name="driver_action"
            className={styles.select}
            value={formData.driver_action}
            onChange={handleChange}
          >
            <option value="">Select driver action</option>
            <option value="Right-of-Way/Traffic Violation">Right-of-Way/Traffic Violation</option>
            <option value="Control/Maneuver Error">Control/Maneuver Error</option>
            <option value="Speed-Related">Speed-Related</option>
            <option value="Other/Unknown">Other/Unknown</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="impact_type">
            Impact Type
          </label>
          <select
            id="impact_type"
            name="impact_type"
            className={styles.select}
            value={formData.impact_type}
            onChange={handleChange}
          >
            <option value="">Select impact type</option>
            <option value="T-Bone">T-Bone</option>
            <option value="Pedestrian/Cyclist">Pedestrian/Cyclist</option>
            <option value="Sideswipe/Approaching">Sideswipe/Approaching</option>
            <option value="Rear End">Rear End</option>
            <option value="Slow/Parked">Slow/Parked</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="age_range">
            Age Range
          </label>
          <select
            id="age_range"
            name="age_range"
            className={styles.select}
            value={formData.age_range}
            onChange={handleChange}
          >
            <option value="">Select age range</option>
            <option value="0–9">0–9</option>
            <option value="10–19">10–19</option>
            <option value="20–29">20–29</option>
            <option value="30–39">30–39</option>
            <option value="40–49">40–49</option>
            <option value="50–59">50–59</option>
            <option value="60–69">60–69</option>
            <option value="70–79">70–79</option>
            <option value="80–89">80–89</option>
            <option value="90+">90+</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>

        <button type="submit" className="predict-button">
          Predict Severity Risk
        </button>
      </form>
      <p>Prediction: {prediction}</p>
    </div>
  );
}
