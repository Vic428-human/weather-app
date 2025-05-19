import type { ForecastResponse } from "@/api/type";

interface WeatherForecastProps {
  data: ForecastResponse;
}

const WeatherForecast = ({ data }: WeatherForecastProps) => {
  return <div>WeatherForecast</div>;
};

export default WeatherForecast;
