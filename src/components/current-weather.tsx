import type { GeocodingResponse, WeatherResponse } from "@/api/type";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

interface CurrentWeatherProps {
  data: WeatherResponse;
  locationName?: GeocodingResponse;
}

const CurrentWeather = ({ data, locationName }: CurrentWeatherProps) => {
  const {
    weather: [currentWeather],
    main: { temp, temp_min, temp_max, humidity, feels_like },
    wind: { speed },
  } = data;
  // 四捨五入
  const formatTemp = (temp: number) => `${Math.round(temp)}°C`;
  console.log("formatTemp", typeof temp);
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {/* grid-cols-2 => 這樣 .container 內的兩個 <div> 就會各佔一半寬度，而且如果內容太多，欄位最小可以縮到 0。 */}
        {/* grid-cols-2 === grid-template-columns: repeat(2, minmax(0, 1fr)) === grid-template-columns: 1fr 1fr;*/}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              {/* flex => 水平對齊 */}
              <div className="flex items-center">
                <h2>{locationName?.name}</h2>
                {/* text-slate-400 直接描述顏色本身的色調 */}
                {/* text-muted-foregroun(有點灰色)、bg-primary、text-error 用來描述顏色「用途」或「角色」的名稱，都是根據 UI 元素的語意 */}
                {/* 語意化的css，在tailwind中更優先使用 */}
                {/* 例如新北市 就沒有 state，所以沒顯示是正常的 */}
                {locationName?.state && (
                  <span className="text-muted-foreground ">
                    , {locationName?.state}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {locationName?.country}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* { letter-spacing: -0.05em; }  */}
              <p className="text-7xl font-bold tracking-tighter">
                {formatTemp(temp)}
              </p>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Feels like {formatTemp(feels_like)}
                </p>

                <div className="flex gap-2 text-sm font-medium">
                  <span className="flex items-center gap-1 text-blue-500">
                    <ArrowDown className="h-3 w-3" />
                    {formatTemp(temp_min)}
                  </span>
                  <span className="flex items-center gap-1 text-red-500">
                    <ArrowUp className="h-3 w-3" />
                    {formatTemp(temp_max)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
