
// create asyn thunk 

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const api = "https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=fc9006ca11486dc490a63b0e7118075b"
const fetchWeather = createAsyncThunk(
    // name of action
    "fetchWeather",
    // api function 
    async () => {
        const res = await fetch(api)
        if (res.ok) throw new Error("failed to fetch weather data")
        const result = await res.json()
        return result // return data 
    }
)

// initialstate 

const initialState = {
    data: null,
    loading: false,
    error: null

}


// slice 
const weatherSlice = createSlice({
    name: "weather",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchWeather.pending, (state) => {
            state.loading = true,
                state.error = null
        })
            .addCase(fetchWeather.fulfilled, (state, action) => {
                state.loading = false,
                    state.data = action.payload
            })
            .addCase(fetchWeather.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
})


export default weatherSlice.reducer;