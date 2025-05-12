import { API_CONFIG } from "./config";

// create a class for managing for all of our apis
class WeatherApi {
    constructor() { }

    // const paramsObj = { appid: API_CONFIG.API_KEY, units: "metric", lang: "en" }; 經過 URLSearchParams 轉換後 => "appid=API_CONFIG.API_KEY&units=metric"
    private createURL(endpoint: string, paramsObj: Record<string, string | number>): string {
        // new URLSearchParams : Search parameters can also be an object =>  https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
        // 根據文章用法 => url = 'http://api.openweathermap.org/data/2.5/weather?q={city_name}&units=metric&appid={API_key}&lang={language}'
        const searchParams = new URLSearchParams({ appid: API_CONFIG.API_KEY, ...paramsObj});
        return `${endpoint}?${searchParams.toString()}` // url
    }
    private fetchData(): string {
        return '123'
    }

    // async methods always return promises => https://stackoverflow.com/questions/67128788/how-can-my-typescript-method-be-typed-as-string-if-it-is-async-and-thus-is-forc
    async getForecast(reference: string): Promise<Response> {
        return await fetch(reference);
    }

    async reverseGeocoding(reference: string): Promise<Response> {
        return await fetch(reference);
    }
}
