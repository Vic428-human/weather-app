import type { WeatherResponse } from "@/api/type";
import { format } from "date-fns";
import { Compass, Gauge, Sunrise, Sunset } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface WeatherDeatailsProps {
  data: WeatherResponse;
}

const WeatherDetails = ({ data }: WeatherDeatailsProps) => {
  const { wind, main, sys } = data;

  // 將日期時間物件格式化為「12 小時制的時:分 AM/PM」的樣式：
  // 假設有一個 Unix 時間戳（單位是秒: 1684402200 → 2025-05-18 09:30:00
  // 格式化後，會分別顯示為 : 9:30 AM
  const formateTime = (timestamp: number) => {
    return format(new Date(timestamp * 1000), "h:mm a");
  };

  const getWeatherDirection = (degree: number) => {
    const directions8 = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    // 先將角度歸一化到0~360
    degree = degree % 360;
    if (degree < 0) degree += 360;

    // 每個區間45度，+22.5讓邊界值正確歸類
    const index = Math.floor((degree + 22.5) / 45) % 8;
    return directions8[index];
  };

  // 今天的日出/日落/風向/氣壓 細節
  const details = [
    {
      title: "日出",
      value: formateTime(sys.sunrise),
      icon: Sunrise,
      color: "text-orange-500",
    },
    {
      title: "日落",
      value: formateTime(sys.sunset),
      icon: Sunset,
      color: "text-blue-500",
    },
    {
      title: "風向",
      value: `${getWeatherDirection(wind.deg)} (${wind.deg}°)`,
      icon: Compass,
      color: "text-green-500",
    },
    {
      title: "氣壓",
      value: `${main.pressure} hPa`,
      icon: Gauge,
      color: "text-purple-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>氣象指標</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 gap-6">
          {details.map((detail) => {
            return (
              <div
                key={detail.title}
                className="flex items-center border rounded-lg gap-3 p-4"
              >
                <detail.icon className={`h-5 w-5 ${detail.color}`} />
                <div>
                  {/* leading-none => line-height: 1; */}
                  <p className="leading-none text-sm font-medium">
                    {detail.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {detail.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherDetails;
