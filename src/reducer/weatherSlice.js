import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;


export const fetchWeather = createAsyncThunk(
  "fetchWeather",
  async (params) => {
    let url = "";
    if (params) {
      if (params.lat && params.lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${params.lat}&lon=${params.lon}&appid=${API_KEY}`;
      } else if (params.city) {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          params.city
        )}&appid=${API_KEY}`;
      } else {
        throw new Error("Invalid parameters to fetch weather");
      }
    } else {
      // Default city coords (you can change this)
      url = `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=${API_KEY}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch weather data");
    const result = await res.json();
    return result;
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
        // Uncomment if you want to clear old data while loading:
        // state.data = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default weatherSlice.reducer;
