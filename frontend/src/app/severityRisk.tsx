import { useState, useEffect } from 'react';
import styles from './severityRisk.module.css';

interface FormData {
  light: string;
  visibility: string;
  roadCondition: string;
  dayOfWeek: string;
  timeOfDay: string;
  season: string;
  vehicleType: string;
  driverAction: string;
  impactType: string;
  ageRange: string;
  neighbourhood: string;
}

interface SeverityRiskProps {
  neighbourhood: string;
}

export default function SeverityRisk({ neighbourhood }: SeverityRiskProps) {
  const [formData, setFormData] = useState<FormData>({
    light: '',
    visibility: '',
    roadCondition: '',
    dayOfWeek: '',
    timeOfDay: '',
    season: '',
    vehicleType: '',
    driverAction: '',
    impactType: '',
    ageRange: '',
    neighbourhood: neighbourhood
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
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
          <label className={styles.label} htmlFor="light">
            Light Condition
          </label>
          <select
            id="light"
            name="light"
            className={styles.select}
            value={formData.light}
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
          <label className={styles.label} htmlFor="roadCondition">
            Road Condition
          </label>
          <select
            id="roadCondition"
            name="roadCondition"
            className={styles.select}
            value={formData.roadCondition}
            onChange={handleChange}
          >
            <option value="">Select road condition</option>
            <option value="Dry">Dry</option>
            <option value="Wet">Wet</option>
            <option value="SnowIce">Snow/Ice</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="timeOfDay">
            Time of Day
          </label>
          <select
            id="timeOfDay"
            name="timeOfDay"
            className={styles.select}
            value={formData.timeOfDay}
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
          <label className={styles.label} htmlFor="dayOfWeek">
            Day of Week
          </label>
          <select
            id="dayOfWeek"
            name="dayOfWeek"
            className={styles.select}
            value={formData.dayOfWeek}
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
          <label className={styles.label} htmlFor="vehicleType">
            Vehicle Type
          </label>
          <select
            id="vehicleType"
            name="vehicleType"
            className={styles.select}
            value={formData.vehicleType}
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
          <label className={styles.label} htmlFor="driverAction">
            Driver Action
          </label>
          <select
            id="driverAction"
            name="driverAction"
            className={styles.select}
            value={formData.driverAction}
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
          <label className={styles.label} htmlFor="impactType">
            Impact Type
          </label>
          <select
            id="impactType"
            name="impactType"
            className={styles.select}
            value={formData.impactType}
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
          <label className={styles.label} htmlFor="ageRange">
            Age Range
          </label>
          <select
            id="ageRange"
            name="ageRange"
            className={styles.select}
            value={formData.ageRange}
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
    </div>
  );
}
