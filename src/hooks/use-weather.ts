import type { Coordinates } from "@/api/type";
import { weatherApi } from "@/api/weather";
import { useQuery } from "@tanstack/react-query";

export const WEATHER_KEYS = {
    weather: (coords: Coordinates) => ['weather', coords] as const,
    forecast: (coords: Coordinates) => ['forecast', coords] as const,
    location: (coords: Coordinates) => ['location', coords] as const,
    search: (query :string) => ['location-search',query ] as const,
} as const; // const means can't be changed


// https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
export function useWeatherQuery(coordinates: Coordinates | null) {
    // queryKey 就像 useEffect 的依賴陣列一樣，會影響查詢的快取（cache）與重新獲取（refetch）邏輯
    // 只要 queryKey 中的任一變數改變（例如 coordinates ），React Query 就會認為這是一個新的查詢，會自動重新發送請求並快取新的結果
    // 查詢函數 queryFn 裡用到的所有變數都應該放進 queryKey，這樣才能保證資料的正確性與快取的獨立性
    // 如果 coordinates 沒有放進 queryKey，即使 coordinates 變了，React Query 也不會認為需要重新查詢，導致資料錯誤
    // 改寫前 => queryKey: ['weather', coordinates] ， 改寫後 => 下面把這部分獨立給 WEATHER_KEYS
    // ?? => 空值合併運算子 : ?? 運算子的意思是：「如果左邊的值不是 null 或 undefined，就用左邊的值；否則用右邊的值。」
    return useQuery({
        queryKey: WEATHER_KEYS.weather(coordinates ?? { lat: 0, lon: 0 }),
        queryFn: () => coordinates ? weatherApi.getCurrentWeather(coordinates) : null,
        enabled: !!coordinates // 用來把一個值「強制轉換成布林值」，兩個驚嘆號 !!：等於「取反再取反」，效果就是把任何值轉成對應的布林值
        // 也就是說，如果 coordinates 是 null 或 undefined，這個查詢就不會被執行
        // enabled 屬性在 React Query（useQuery）中用來控制查詢是否自動執行。預設情況下，enabled 為 true，查詢會在組件掛載時自動發送。如果你將 enabled 設為 false，查詢則不會自動執行，僅在你手動觸發時（例如呼叫 refetch()）才會發送請求
   
    }) 
}

export function useForecastQuery(coordinates: Coordinates | null) {
    return useQuery({
        queryKey: WEATHER_KEYS.forecast(coordinates ?? { lat: 0, lon: 0 }),
        queryFn: () => coordinates ? weatherApi.getForecast(coordinates) : null,
        enabled: !!coordinates 
    }) 
}

export function useReverseGerocodeQuery(coordinates: Coordinates | null | undefined) {
    return useQuery({
        queryKey: WEATHER_KEYS.location(coordinates ?? { lat: 0, lon: 0 }),
        queryFn: () => coordinates ? weatherApi.reverseGeocoding(coordinates) : null,
        enabled: !!coordinates 
    }) 
}

export function useLocationSearch(query: string) {
    return useQuery({
        queryKey: WEATHER_KEYS.search(query),
        queryFn: () => weatherApi.searchLocations(query),
        enabled: query.length >= 3,
    }) 
}