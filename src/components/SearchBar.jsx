import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeather } from "../reducer/weatherSlice";

export default function WeatherPage() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.weather);
  const [searchHistory, setSearchHistory] = useState(
    JSON.parse(localStorage.getItem("searchHistory")) || []
  );

  // Load default weather for Delhi on mount
  useEffect(() => {
    dispatch(fetchWeather("Delhi"));
  }, [dispatch]);

  // Handle new city search from SearchBar
  const handleSearch = (city) => {
    dispatch(fetchWeather(city));

    // Save to history, max 5 unique entries
    setSearchHistory((prev) => {
      const updated = [city, ...prev.filter((c) => c !== city)].slice(0, 5);
      localStorage.setItem("searchHistory", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <SearchBar onSearch={handleSearch} />

      {searchHistory.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Search History</h2>
          <div className="flex gap-2 flex-wrap">
            {searchHistory.map((city, idx) => (
              <button
                key={idx}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => handleSearch(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        {loading && <p>Loading weather...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {data && (
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-xl font-bold">{data.name} Weather</h3>
            <p>Temperature: {(data.main.temp - 273.15).toFixed(1)}°C</p>
            <p>Condition: {data.weather[0].main}</p>
            <p>Wind Speed: {data.wind.speed} m/s</p>
            <p>Humidity: {data.main.humidity}%</p>
          </div>
        )}
      </div>
    </div>
  );
}
