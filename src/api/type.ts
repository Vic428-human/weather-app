export interface Coordinates {
  lat: number
  lon: number
}

// 透過 lat,lon 地址 查詢該地區的氣候情況 
// https://api.openweathermap.org/data/2.5/weather?q=London
// https://docs.openweather.co.uk/weather-conditions

//  根據座標地址
// https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid={API key}
export interface WeatherCondition {
  id: number,
  main: string,
  description: string,
  icon: string,
}
export interface WeatherResponse {
  coord: Coordinates;
  weather: WeatherCondition[];
  main: Main;
  wind: Wind;
  dt: number;
  sys: Sys;
  name: string;
}

export interface ForecastResponse{
  list:Array<{
    dt: number,
    main: WeatherResponse['main'],
    weather: WeatherResponse['weather'],
    wind: WeatherResponse['wind'],
    dt_txt: string
  }>;
  city:{
    name: string,
    country: string,
    sunrise: number,
    sunset: number
  }
}

export interface GeocodingResponse{
  name: string,
  local_names?: Record<string, string>,
  lat: number,
  lon: number,
  country: string,
  state?: string
}

interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}

interface Wind {
  speed: number;
  deg: number;
}

interface Sys {
  country: string;
  sunrise: number;
  sunset: number;
}
