"use client";

export default function WeatherCard({ item }) {
  function kelvinToCelsius(k) {
    return +(k - 273.15).toFixed(2);
  }
  const date = new Date(item.dt * 1000).toISOString().split("T")[0];
  const fullDate = new Date(item.dt * 1000);
  const time = fullDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Dhaka"
  });

  return (
      <div className="border bg-white rounded-2xl p-4 flex justify-between items-center mb-2 transition-all duration-200">
        {/* Left Column */}
        <div className="space-y-1">
          <div className="text-sm text-gray-600 dark:text-gray-400">{date}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500">{time}</div>
          <div className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            {Math.round(kelvinToCelsius(item.temp.day || item.temp))}°C
          </div>
          <h2>{item.weather[0].main}</h2>
        </div>
        {/* Right Column */}
        <div className="text-right text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <div className="grid grid-cols-2 gap-x-3">
            <div>Humidity : {item.humidity}%</div>
            <div>Wind : {item.wind_speed} m/s</div>
          </div>
          <div className="grid grid-cols-2 gap-x-3">
            <div>Pressure : {item.pressure} hPa</div>
            <div>Cloud Cover : {item.clouds}%</div>
          </div>
        </div>
      </div>
  );
}
