import type { ForecastResponse } from "@/api/type";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface WeatherForecastProps {
  data: ForecastResponse;
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

const WeatherForecast = ({ data }: WeatherForecastProps) => {
  //   Array.reduce(callback[accumulator, currentValue, currentIndex, array], initialValue)
  //   目前API回傳的數據有些雜亂，我只想要當天的氣象預報，意指 以當日的日期當作key，value則放一些我需要的內容 參考 DailyForecast
  //   先換算出當天日期，是一個物件，裡面包著好幾個小物件
  const dailyForecast = data.list.reduce((accumulator, currentValue) => {
    const date = format(new Date(currentValue.dt * 1000), "yyyy-mm-dd");
    if (!accumulator[date]) {
      accumulator[date] = {
        date: currentValue.dt,
        temp_min: currentValue.main.temp_min,
        temp_max: currentValue.main.temp_max,
        humidity: currentValue.main.humidity,
        wind: currentValue.wind.speed,
        weather: currentValue.weather[0],
      };
    } else {
      accumulator[date].temp_min = Math.min(
        accumulator[date].temp_min,
        currentValue.main.temp_min
      );
      accumulator[date].temp_max = Math.max(
        accumulator[date].temp_max,
        currentValue.main.temp_max
      );
    }
    return accumulator;
  }, {} as Record<string, DailyForecast>); // {} 是 initialValue
  console.log("dailyForecast", dailyForecast);
  //   Object.values() 是直接取得所有 property value，並以陣列回傳。看一個簡單的範例： => https://ithelp.ithome.com.tw/articles/10239942
  //   這裡回傳的有6筆
  const nextDays = Object.values(dailyForecast).slice(0, 6); // 剛才的key就會不在了，保留的是子物件
  console.log(nextDays);
  return (
    <Card>
      <CardHeader>
        <CardTitle>接下來五天的氣象預報</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {nextDays.map((day) => {
            return (
              <div key={day.date}>
                <div>
                  <p>{format(new Date(day.date * 1000), "EEE, MMM d yyyy")}</p>
                  <p>{day.weather.description}</p>
                </div>
                <div></div>
                <div></div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
