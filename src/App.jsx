import { WeatherProvider } from "./Context/weatherProvider";
import Forecast from "./Component/Forecast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./Component/AppLayout";
import WeatherInfo from "./Component/WeatherInfo";

let require = "solve issue";

function App() {
  return (
    <WeatherProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate replace to="weather" />} />
            <Route index path="weather" element={<WeatherInfo />} />
            <Route path="forecast" element={<Forecast />} />
          </Route>

          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </BrowserRouter>
    </WeatherProvider>
  );
}

export default App;
