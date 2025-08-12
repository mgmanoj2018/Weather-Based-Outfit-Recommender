import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeather } from "../reducer/weatherSlice";
import { motion } from "framer-motion";
import { FaUmbrella } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { MdOutlineLightMode } from "react-icons/md";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  WiCloud,
  WiDaySunny,
  WiRain,
  WiStrongWind,
  WiHumidity,
} from "react-icons/wi";



// Animated icons for weather display
export function AnimatedWiCloud() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ display: "inline-block" }}
    >
      <WiCloud size={40} />
    </motion.div>
  );
}

export function AnimatedWiDaySunny() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      style={{ display: "inline-block" }}
    >
      <WiDaySunny size={40} />
    </motion.div>
  );
}

export function AnimatedWiRain() {
  return (
    <motion.div
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ display: "inline-block" }}
    >
      <WiRain size={40} />
    </motion.div>
  );
}

export function AnimatedWiStrongWind() {
  return (
    <motion.div
      animate={{ x: [0, 10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ display: "inline-block" }}
    >
      <WiStrongWind size={30} />
    </motion.div>
  );
}

export function AnimatedWiHumidity() {
  return (
    <motion.div
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      style={{ display: "inline-block" }}
    >
      <WiHumidity size={30} />
    </motion.div>
  );
}

// Animated icons for suggestions
const AnimatedUmbrella = () => (
  <motion.div
    animate={{ y: [0, -5, 0] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    style={{ display: "inline-block", marginRight: 6 }}
  >
    <FaUmbrella size={20} color="#2c7a7b" />
  </motion.div>
);

const AnimatedJacket = () => (
  <motion.div
    animate={{ scale: [1, 1.1, 1] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    style={{ display: "inline-block", marginRight: 6 }}
  >
    <GiJacket size={20} color="#718096" />
  </motion.div>
);

const AnimatedSun = () => (
  <motion.div
    animate={{ rotate: [0, 15, -15, 15, -15, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    style={{ display: "inline-block", marginRight: 6 }}
  >
    <FiSun size={20} color="#ecc94b" />
  </motion.div>
);

const AnimatedLightMode = () => (
  <motion.div
    animate={{ rotate: [0, 10, -10, 10, -10, 0] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    style={{ display: "inline-block", marginRight: 6 }}
  >
    <MdOutlineLightMode size={20} color="#63b3ed" />
  </motion.div>
);

// Suggestion helper returning JSX with animated icon + text
function getSuggestion(condition, tempC) {
  const cond = condition.toLowerCase();

  if (cond.includes("rain"))
    return (
      <>
        <AnimatedUmbrella />
        Take an umbrella
      </>
    );
  if (tempC < 10)
    return (
      <>
        <AnimatedJacket />
        Wear a jacket
      </>
    );
  if (cond.includes("sun") || cond.includes("clear"))
    return (
      <>
        <AnimatedSun />
        Sunglasses suggested
      </>
    );
  if (cond.includes("cloud"))
    return (
      <>
        <AnimatedLightMode />
        Light jacket might be good
      </>
    );

  return "Have a nice day!";
}

// Return correct animated weather icon
function getWeatherIcon(condition) {
  const cond = condition.toLowerCase();

  if (cond.includes("cloud")) return <AnimatedWiCloud />;
  if (cond.includes("rain")) return <AnimatedWiRain />;
  if (cond.includes("sun") || cond.includes("clear")) return <AnimatedWiDaySunny />;
  return <AnimatedWiDaySunny />;
}

export default function WeatherComponent() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.weather);

  const [lastCities, setLastCities] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    dispatch(fetchWeather()); // initial fetch default city
  }, [dispatch]);

  useEffect(() => {
    if (data && data.name) {
      setLastCities((prev) => {
        const filtered = prev.filter((c) => c.name !== data.name);
        const updated = [data, ...filtered];
        return updated.slice(0, 5);
      });
    }
  }, [data]);

  const fetchCitySuggestions = async (search) => {
    if (!search) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=fc9006ca11486dc490a63b0e7118075b`
      );
      const json = await res.json();
      setSuggestions(
        json.map((city) => ({
          name: city.name,
          state: city.state,
          country: city.country,
          lat: city.lat,
          lon: city.lon,
        }))
      );
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const onChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      fetchCitySuggestions(val);
    }, 300);
  };

  const onSelectSuggestion = (city) => {
    setQuery(`${city.name}${city.state ? ", " + city.state : ""}, ${city.country}`);
    setSuggestions([]);
    setShowSuggestions(false);
    dispatch(fetchWeather({ lat: city.lat, lon: city.lon }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSuggestions([]);
    setShowSuggestions(false);
    dispatch(fetchWeather({ city: query.trim() }));
  };

  const renderCityCard = (cityData) => {
    const tempC = Math.round(cityData.main.temp - 273.15);
    const condition = cityData.weather[0].description;
    const windSpeed = cityData.wind.speed;
    const humidity = cityData.main.humidity;
    const suggestion = getSuggestion(condition, tempC);

    return (
      <Card
        key={cityData.id || cityData.name}
        className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-4 rounded shadow cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => dispatch(fetchWeather({ city: cityData.name }))}
        title={`Click to view weather for ${cityData.name}`}
      >
        <CardHeader>
          <CardTitle className="text-xl font-semibold truncate">{cityData.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3 mb-2">
            <div className="text-4xl font-bold">{tempC}°C</div>
            <div className="flex flex-col items-center text-sm">
              {getWeatherIcon(condition)}
              <span className="capitalize">{condition}</span>
            </div>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <div className="flex flex-col items-center">
              <AnimatedWiStrongWind />
              <span>{windSpeed} m/s</span>
            </div>
            <div className="flex flex-col items-center">
              <AnimatedWiHumidity />
              <span>{humidity}%</span>
            </div>
          </div>

          <p className="italic text-yellow-200 text-xs flex items-center">
            {suggestion}
          </p>
        </CardContent>
      </Card>
    );
  };

  const tempC = Math.round(data?.main.temp - 273.15);
  const condition = data?.weather[0].description || "";
  const windSpeed = data?.wind.speed;
  const humidity = data?.main.humidity;
  const suggestion = getSuggestion(condition, tempC);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Search box */}
      <form onSubmit={onSubmit} className="mb-6 relative max-w-md mx-auto">
        <input
          type="text"
          value={query}
          onChange={onChange}
          placeholder="Search city..."
          className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onFocus={() => {
            if (suggestions.length) setShowSuggestions(true);
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-y-auto shadow-lg">
            {suggestions.map((city, i) => (
              <li
                key={i}
                onClick={() => onSelectSuggestion(city)}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                {city.name}
                {city.state ? `, ${city.state}` : ""}, {city.country}
              </li>
            ))}
          </ul>
        )}
      </form>

      {/* Main weather card */}
      <Card className="bg-gradient-to-br from-blue-400 to-indigo-600 text-white p-6 mb-6 max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{data?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-center text-gray-200">Loading...</p>}
          {error && <p className="text-center text-red-300">{error}</p>}
          {!loading && !error && data && (
            <>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="text-6xl font-extrabold">{tempC}°C</div>
                <div className="flex flex-col items-center text-lg">
                  {getWeatherIcon(condition)}
                  <span className="capitalize mt-1">{condition}</span>
                </div>
              </div>

              <div className="flex justify-around text-lg mb-4">
                <div className="flex flex-col items-center">
                  <AnimatedWiStrongWind />
                  <span className="mt-1">{windSpeed} m/s</span>
                  <small>Wind</small>
                </div>

                <div className="flex flex-col items-center">
                  <AnimatedWiHumidity />
                  <span className="mt-1">{humidity}%</span>
                  <small>Humidity</small>
                </div>
              </div>

              <p className="text-center italic text-yellow-200 text-lg font-semibold flex justify-center items-center">
                {suggestion}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Last searched cities cards */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Last searched cities</h2>
        {lastCities.length === 0 ? (
          <p className="text-gray-500">No recent searches</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {lastCities.map((cityData) => renderCityCard(cityData))}
          </div>
        )}
      </div>
    </div>
  );
}
