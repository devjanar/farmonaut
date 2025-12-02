"use client"

export default function WeatherSummary({ current, location, lat, lon }) {
  function kelvinToCelsius(k) {
    return +(k - 273.15).toFixed(2);
  }
  const date = new Date(current.dt * 1000).toUTCString();
  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4">
      <div className="flex justify-between text-lg text-gray-500 mb-2">
        <div>Current Summary:</div>
        <div>{date}</div>
      </div>
      <div className="text-gray-600 mb-4">
        Weather Station: <span className="font-medium">{location?.name}</span> [
        {lon}, {lat}]
      </div>

      <div className="flex items-center gap-4">
        <div className="max-w-xs mx-auto bg-white dark:bg-gray-800 shadow-md rounded-xl p-10 text-center ml-0">
          <div className="text-gray-500 text-sm mb-1">Current Temperature</div>
          <div className="text-4xl font-bold text-gray-900 dark:text-white">
            {Math.round(kelvinToCelsius(current.temp))}°C
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-md transition flex justify-between items-center">
              <span>💧 Humidity</span>
              <span className="font-semibold">{current.humidity}%</span>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-md transition flex justify-between items-center">
              <span>☁️ Cloud Cover</span>
              <span className="font-semibold">{current.clouds}%</span>
            </div>
          </div>
          {/* Right Column */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-md transition flex justify-between items-center">
              <span>🌬 Wind</span>
              <span className="font-semibold">{current.wind_speed} m/s</span>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-md transition flex justify-between items-center">
              <span>📉 Pressure</span>
              <span className="font-semibold">{current.pressure} hPa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
