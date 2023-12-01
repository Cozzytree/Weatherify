import { useEffect, useState } from "react";
import { useWeather } from "../Context/weatherProvider";
import { MdOutlineMyLocation } from "react-icons/md";
import Cities from "./Cities";
import { useNavigate } from "react-router";

function WeatherForm() {
  const {
    Geocoding,
    geocodingData,
    fetchWeather,
    isLoading,
    GetLocation,
    currentPosition,
  } = useWeather();
  const navigate = useNavigate();
  const [form, setForm] = useState("");

  useEffect(() => {
    if (form.length > 2) Geocoding(form);
  }, [form, Geocoding]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form) return;
    Geocoding(form);
    fetchWeather(geocodingData[0].lat, geocodingData[0].lon);
    setForm("");
    navigate("weather");
  }

  useEffect(() => {
    if (currentPosition.lat && currentPosition.lng) {
      fetchWeather(currentPosition.lat, currentPosition.lng);
    }
  }, [currentPosition.lat, currentPosition.lng, navigate, fetchWeather]);

  function handlePosition() {
    GetLocation();
    navigate("weather");
  }

  return (
    <div className="relative flex flex-col gap-2 items-center mt-8">
      <form
        action=""
        className="flex gap-0 py-1 relative "
        onSubmit={handleSubmit}
      >
        <MdOutlineMyLocation
          onClick={handlePosition}
          fill="blue"
          className="absolute right-10 sm:top-[25%] top-2 cursor-pointer h-5 text-3xl"
        />
        <input
          value={form}
          onChange={(e) => {
            setForm(e.target.value);
          }}
          type="text"
          placeholder="Seach for cities"
          className="sm:w-60 w-40 focus:outline-none bottom-0 rounded-l-md py-1 px-3 bg-stone-100/60 font-semibold text-md text-black-900"
          autoFocus
        />
        <button>
          <svg
            className="bg-stone-100/60 w-8 h-8 p-2 rounded-r-md"
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
            fill="green"
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>
        </button>
      </form>
      {!isLoading && form && <Cities setForm={setForm} />}
    </div>
  );
}

export default WeatherForm;
