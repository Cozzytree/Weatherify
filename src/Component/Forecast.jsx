import { useNavigate } from "react-router";
import { useWeather } from "../Context/weatherProvider";
import { random } from "./Cities";
import { useEffect, useRef, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import { FaArrowRightLong } from "react-icons/fa6";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Forecast() {
  const { forecastsData } = useWeather();
  const [data, setData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const navigate = useNavigate();
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(250);
  const chartRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chartRef.current === event.target) {
        setShowChart(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setShowChart]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setWidth(250);
        setHeight(200);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const options = {
    animationEnabled: true,
    theme: "dark2",
    width: width,
    height: height,
    dataPointMaxWidth: 10,
    dataPointMinWidth: 2,
    title: {
      text: "Temperature (in celcius) throught the day",
      fontFamily: "Impact",
      fontSize: 20,
      fontWeight: "light",
    },
    axisX: {
      prefix: "H",
      interval: 3,
    },
    axisY: {
      title: "temperature C",
    },
    data: [
      {
        xValueFormatString: "hh:mm TT",
        type: "line",
        dataPoints: data,
      },
    ],
  };

  if (forecastsData.length === 0)
    return (
      <div className="flex flex-col gap-2 font-ubuntu">
        <button
          className="bg-stone-400 trasnsition-all duration-100 py-2 rounded-lg font-bold px-2 sm:hover:bg-stone-50"
          onClick={() => {
            navigate(-1);
          }}
        >
          &larr; Back
        </button>
        <p className="text-stone-50 font-bold text-xl">No data to show</p>
      </div>
    );
  return (
    <>
      <div className="text-stone-50 bg-stone-6 sm:w-screen w-[20em] justify-center 00/50 px-4 py-3 mt-5 rounded-lg flex gap-5 overflow-scroll sm:overflow-visible h-[20em] flex-wrap relative font-ubuntu">
        {forecastsData.forecastday.map((forecast) => (
          <ForecastItem
            key={random(10)}
            forecast={{ ...forecast, id: random(10) }}
            setData={setData}
            setShowChart={setShowChart}
          />
        ))}
      </div>
      {showChart && (
        <div
          className="absolute w-screen inset-0 flex justify-center items-center backdrop-blur-sm bg-stone-500/5 transition-all duration-100"
          ref={chartRef}
        >
          <div className="w-[18em] sm:w-[38em] md:w-[25] flex justify-center">
            <CanvasJSChart options={options} />
          </div>
        </div>
      )}
    </>
  );
}

function ForecastItem({ forecast, setData, setShowChart }) {
  function handleData() {
    const hourData = forecast.hour.map((item) => ({
      x: new Date(item.time).getHours(),
      y: item.temp_c,
    }));
    setData(hourData);
    setShowChart(true);
  }

  return (
    <div className="sm:w-[12em] bg-stone-700/20 h-[15em] rounded-lg p-2 w-52 cursor-pointer md:hover:scale-105 transition-all duration-300 backdrop-blur-[1px] space-y-2 tracking-tight">
      <p className="text-sm font-bold tracking-tight">{forecast.date}</p>
      <div>
        <img
          className="text-xs sm:text-md "
          src={forecast.day.condition.icon}
          alt=""
        />
        <span className="text-xs sm:text-[1em] font-bold text-stone-50">
          {forecast.day.condition.text}
        </span>
      </div>
      <p className="text-xs sm:text-[1em] text-stone-50 flex space-x-2">
        <span> Avg Temp : </span>
        <span className="font-bold">{forecast.day.avgtemp_c}&deg; C</span>
      </p>
      <p className="text-xs sm:text-[1em] text-stone-50 flex space-x-2">
        <span> Max Temp :</span>
        <span className="font-bold"> {forecast.day.maxtemp_c}&deg; C</span>
      </p>
      <p className="text-xs sm:text-[1em] text-stone-50 flex space-x-2">
        <span> Max Wind :</span>
        <span className="font-bold"> {forecast.day.maxwind_kph} kph</span>
      </p>
      <button
        className="underline text-blue-700 font-bold px-1 rounded-md flex items-center gap-1 bg-blue-50/90"
        onClick={handleData}
      >
        <em>show chart </em> <FaArrowRightLong />
      </button>
    </div>
  );
}

export default Forecast;
