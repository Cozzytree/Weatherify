import { createContext, useCallback, useContext, useReducer } from "react";
export const API_Key = "5fc1bf037a934e1286533936232608&q";
export const GeoCode_API = "c0df3fc7e063e056f01ea57e64ebaa3f";
const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=`;
const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=`;

const initialState = {
  isLoading: false,
  geocodingData: [],
  weatherData: {},
  forecastsData: [],
  location: {},
  currentPosition: [],
  err: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "fetching":
      return { ...state, isLoading: true, err: "" };
    case "fetched/location":
      return { ...state, geocodingData: action.payload };
    case "fetched/weather":
      return {
        ...state,
        weatherData: action.payload.current,
        forecastsData: action.payload.forecast,
        location: action.payload.location,
      };
    case "location":
      return { ...state, currentPosition: action.payload };
    case "error":
      return { ...state, err: action.payload };
    case "completed":
      return { ...state, isLoading: false };
    default:
      throw new Error("undefined");
  }
}

const WeatherContext = createContext();

function WeatherProvider({ children }) {
  const [
    {
      isLoading,
      weatherData,
      forecastsData,
      geocodingData,
      location,
      currentPosition,
      err,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const Geocoding = useCallback(async function Geocoding(city) {
    const controller = new AbortController();
    try {
      dispatch({ type: "fetching" });
      const response = await fetch(
        `${geocodingUrl}${city}&limit=${5}&appid=${GeoCode_API}`,
        { signal: controller.signal }
      );
      const data = await response.json();
      if (!data.length) throw new Error("Couldn't find location");
      dispatch({ type: "fetched/location", payload: data });
    } catch (error) {
      if (error.name === "AbortError") return;
      dispatch({ type: "error", payload: error.message });
    } finally {
      dispatch({ type: "completed" });
    }
  }, []);

  async function GetLocation() {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    dispatch({
      type: "location",
      payload: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
    });
  }

  const fetchWeather = useCallback(async function fetchWeather(lat, lon) {
    try {
      dispatch({ type: "fetching" });
      const response = await fetch(
        `${weatherUrl}${API_Key}=${lat},${lon}&days=7&aqi=no&alerts=no`
      );
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      console.log(data);
      dispatch({
        type: "fetched/weather",
        payload: {
          current: data.current,
          forecast: data.forecast,
          location: data.location,
        },
      });
    } catch (err) {
      console.error(err);
      dispatch({ type: "error", payload: err.message });
    } finally {
      dispatch({ type: "completed" });
    }
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        fetchWeather,
        isLoading,
        weatherData,
        forecastsData,
        geocodingData,
        Geocoding,
        GetLocation,
        location,
        currentPosition,
        err,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

const useWeather = () => {
  const context = useContext(WeatherContext);
  return context;
};

export { useWeather, WeatherProvider };
