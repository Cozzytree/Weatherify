import { Link } from "react-router-dom";
import { useWeather } from "../Context/weatherProvider";

export function random(num) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWZYZ123456789";
  let code = "";
  for (let i = 0; i <= num; i++) {
    code += letters[Math.floor(Math.random() * letters.length)];
  }
  return code;
}

function Cities({ setForm }) {
  const { geocodingData } = useWeather();

  if (geocodingData.length === 0) return;

  return (
    <div className="absolute bg-stone-800/40 sm:w-80 w-60 border-[0.5px] border-stone-50/30 rounded-md z-10 top-[110%]">
      {geocodingData?.map((cities) => (
        <CityItem cities={cities} key={random(10)} setForm={setForm} />
      ))}
    </div>
  );
}

function CityItem({ cities, setForm }) {
  const { fetchWeather } = useWeather();

  return (
    <Link to={"weather"}>
      <div
        className="py-1 px-1 font-semibold border-b-[1px] border-b-stone-100/10"
        onClick={() => {
          fetchWeather(cities.lat, cities.lon);
          setForm("");
        }}
      >
        <p
          className={`text-stone-100 flex gap-2 items-center cursor-pointer sm:hover: duration-100 transition-all`}
        >
          <img
            src={`https://flagsapi.com/${cities.country}/shiny/24.png`}
            alt=""
          />
          <span className="text-sm">{cities.state}</span>{" "}
        </p>
      </div>
    </Link>
  );
}

export default Cities;
