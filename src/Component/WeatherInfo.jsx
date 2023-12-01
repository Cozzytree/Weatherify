import { useEffect, useState } from "react";
import { useWeather } from "../Context/weatherProvider";
import Spinner from "./Spinner";
import Error from "./Error";
import { NavLink } from "react-router-dom";

function WeatherInfo() {
  const { weatherData, location, err, isLoading } = useWeather();
  const [temps, setTemps] = useState(weatherData ? weatherData.temp_c : 0);
  useEffect(() => {
    setTemps(weatherData ? weatherData.temp_c : 0);
  }, [weatherData]);

  if (isLoading) return <Spinner />;
  if (err) return <Error>{err}</Error>;

  if (!weatherData.condition) return;

  return (
    <div className="animateOpacity mt-10 relative px-3 py-2 text-stone-50 sm:w-96 w-80 border-[0.1px] border-transparent h-96 backdrop-blur-sm rounded-3xl bg-gradient-to-br from-stone-800/60 transition-all duration-75 shadow-sm shadow-stone-700/50 font-ubuntu">
      <p className="absolute right-1 top-1 text-xs sm:text-md">
        Last Updated :
        <span>
          {Intl.DateTimeFormat("en-IN", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(new Date(weatherData.last_updated))}
        </span>
      </p>
      <div className="flex justify-center items-center gap-10">
        <div className="flex flex-col items-center">
          <img src={weatherData.condition.icon} alt="" className="w-20" />
          <span>{weatherData.condition.text}</span>
        </div>
        <div className="relative w-[6em]">
          <h1 className="text-[2em] capitalize font-bold">
            {temps ? temps : weatherData.temp_c}&deg;
          </h1>
          <div className="absolute flex gap-1 right-[-40%] top-[-10%] items-center">
            <span
              onClick={() => setTemps(weatherData.temp_c)}
              className={`cursor-pointer text-md transition-all duration-100 ${
                temps === weatherData.temp_c
                  ? "text-3xl text-lime-400 font-extrabold"
                  : ""
              }`}
            >
              C
            </span>
            <span className="text-xl font-extrabold">|</span>
            <span
              onClick={() => setTemps(weatherData.temp_f)}
              className={`cursor-pointer transition-all duration-100 ${
                temps === weatherData.temp_f
                  ? "text-2xl font-[900] text-lime-300"
                  : ""
              }`}
            >
              F
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start text-md w-60 p-1 absolute uppercase">
        <p className="flex justify-between w-[100%]">
          <span>feels like</span>:<span>{weatherData.feelslike_c}&deg;C</span>
        </p>
        <p className="flex justify-between w-[100%]">
          <span> uv index</span>:<span>{weatherData.uv}</span>{" "}
        </p>

        <p className="flex justify-between w-[100%]">
          <span>visibility </span>: <span>{weatherData.vis_km} km</span>{" "}
        </p>
        <p className="flex justify-between w-[100%]">
          <span>wind</span> : <span> {weatherData.wind_kph} kph</span>
        </p>
        <p className="flex justify-between w-[100%]">
          <span>pressure</span>:<span>{weatherData.pressure_in} (inches)</span>{" "}
        </p>
      </div>
      <div className="uppercase flex flex-col absolute bottom-1">
        <h1 className="text-xl font-extrabold ">{location.country}</h1>
        <p>
          {location.name} , <span>{location.region}</span>
        </p>
        <p className="text-sm">
          local t :
          <span className="sm:text-md text-sm"> {location.localtime}</span>
        </p>
      </div>
      <NavLink
        to={"/forecast"}
        className="absolute bottom-2 right-2 underline text-blue-400"
      >
        forecasts &rarr;
      </NavLink>
    </div>
  );
}

export default WeatherInfo;
