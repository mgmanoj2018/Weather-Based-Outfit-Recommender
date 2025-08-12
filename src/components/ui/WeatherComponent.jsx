import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeather } from "./weatherSlice";

export default function WeatherComponent() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.weather);

  useEffect(() => {
    dispatch(fetchWeather());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{color:"red"}}>{error}</p>;

  return (
    <div>
      {data && (
        <>
          <h1>{data.name}</h1>
          <p>{Math.round(data.main.temp - 273.15)}°C</p>
          <p>{data.weather[0].description}</p>
        </>
      )}
    </div>
  );
}
