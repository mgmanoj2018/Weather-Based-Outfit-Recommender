import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "../reducer/weatherSlice"; 

const store = configureStore({
  reducer: {
    weather: weatherReducer, 
  },
});

export default store;
