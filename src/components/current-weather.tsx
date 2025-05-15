import type { GeocodingResponse, WeatherResponse } from "@/api/type";
import React from "react";
import { Card, CardContent } from "./ui/card";

interface CurrentWeatherProps {
  data: WeatherResponse;
  locationName?: GeocodingResponse;
}

const CurrentWeather = ({ data, locationName }: CurrentWeatherProps) => {
  const {
    weather: [currentWeather],
    main: { temp, temp_min, temp_ma, humidity, feels_like },
    wind: { speed },
  } = data;
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
          </div>

          <div></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
