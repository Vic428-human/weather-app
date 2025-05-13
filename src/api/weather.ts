import { API_CONFIG } from "./config";
import type { Coordinates, WeatherResponse } from "./type";

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

    // https://stackoverflow.com/questions/60231727/async-function-that-returns-a-promise-or-string-typescript

    // interface IResponse {
    //     access_token: string;
    //     refresh_token: string;
    //     userRoles: string[];
    //   }

    // async function test() {
    //     const result = await fetchData<IResponse>("url");
    //     if (!('error' in result)) {
    //       console.log(result.access_token);
    //     }
    //   }
    private async fetchData<T>(url: string): Promise<T | { error: string}> {
        const res = await fetch(url);
      
        // 也可以改成這樣寫 if (!res.ok) return { error: 'error text' };
        if (!res.ok) throw new Error(`氣候API錯誤訊息：${res.statusText}`);
        return res.json();
    }

    async getCurrentWeather({lat,lon}:Coordinates):Promise<WeatherResponse | { error: string}>{
        const url = this.createURL(`${API_CONFIG.BASE_URL}/weather`, { lat: lat.toString(), lon:lon.toString(), units: API_CONFIG.DEFAULT_PARAMS.units});
        return this.fetchData<WeatherResponse>(url);
    }

    // async methods always return promises => https://stackoverflow.com/questions/67128788/how-can-my-typescript-method-be-typed-as-string-if-it-is-async-and-thus-is-forc
    async getForecast(reference: string): Promise<Response> {
        return await fetch(reference);
    }

    async reverseGeocoding(reference: string): Promise<Response> {
        return await fetch(reference);
    }
}
