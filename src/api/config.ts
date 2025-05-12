export const API_CONFIG = {
    BASE_URL: "https://api.openweathermap.org/data/2.5", // https://docs.openweather.co.uk/current
    GEOCODING_API: "http://api.openweathermap.org/geo/1.0", // https://docs.openweather.co.uk/api/geocoding-api#reverse
    API_KEY:import.meta.env.VITE_REACT_APP_WEATHER_API, // https://vite.dev/guide/env-and-mode
    DEFAULT_PARAMS:{
        appid: import.meta.env.VITE_REACT_APP_WEATHER_API, // units 跟 appid 的使用時機 => https://blog.csdn.net/qq_46603846/article/details/139891004
        units: "metric", // https://docs.openweather.co.uk/weather-data
        lang: "en"
    }
};