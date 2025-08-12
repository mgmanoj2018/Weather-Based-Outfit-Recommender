// SearchCity.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchWeather } from "../reducer/weatherSlice";
// import { fetchWeather } from "./weatherSlice";

export default function SearchCity() {
  const [city, setCity] = useState("");
  const dispatch = useDispatch();

  const handleSearch = () => {
    if (city.trim()) {
      dispatch(fetchWeather(city));
      setCity("");
    }
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <input
        type="text"
        value={city}
        placeholder="Enter city name"
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
