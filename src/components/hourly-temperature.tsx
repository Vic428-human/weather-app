import type { ForecastResponse } from "@/api/type";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Legend,
  Line,
} from "recharts"; //相關配置參考 https://blog.csdn.net/m0_73734137/article/details/135436840
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { format } from "date-fns";
import { ArrowDown, ArrowUp } from "lucide-react";

interface HourlyTempratureProps {
  data: ForecastResponse;
}

const HourlyTemprature = ({ data }: HourlyTempratureProps) => {
  // Call 5 day / 3 hour forecast
  // console.log("chartData", chartData); 可以看到數據是每隔３小時一筆
  // 而我需要的是一整天的情況，從現在這個時間，往後推24小時，也就是8筆
  //   console.log("chartDatas", chartDatas)

  const chartData = data.list.slice(0, 8).map((item) => {
    // item.dt => timestamp => unix 時間戳記

    // * 1000 => 轉成毫秒

    // new Date(...)：產生一個 Date 物件，代表本地時間。
    // const date = new Date(item.dt * 1000);
    // 假設 date => Sun Jun 15 2025 08:00:00 GMT+0800 (台北標準時間)

    return {
      time: format(new Date(item.dt * 1000), "ha"), // hour and am/pm
      temp: Math.round(item.main.temp),
      feels_like: Math.round(item.main.feels_like),
    };
  });

  const formatXAxis = (tickFormat: any) => {
    return `${tickFormat} 度`;
  };

  // payload => contain all the value，例如
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // console.log("payload===>", payload); index 0 => 是當前溫度 , index 1 => 是感覺溫度
      return (
        <div className="round-lg border bg-amber-200 p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <span className="flex items-center gap-1 text-[0.70rem] uppercase text-muted-foreground">
                現在溫度 <ArrowDown className="h-3 w-3" />
              </span>
              <span className="text-blue-500 font-bold">
                {payload[0].value} °C
              </span>
            </div>
            <div className="flex flex-col">
              <span className="flex items-center gap-1 text-[0.70rem] uppercase text-muted-foreground ">
                體感溫度 <ArrowUp className="h-3 w-3" />
              </span>
              <span className="text-red-500 font-bold">
                {payload[1].value} °C
              </span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Today's temperature</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          {/* Creating responsive charts */}
          {/* https://recharts.org/en-US/api/ResponsiveContainer */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              {/* 如果需要隔線區分，不需要就註解就好 */}
              <CartesianGrid />
              <XAxis
                dataKey="time"
                stroke="#888888"
                fontSize={12}
                tickLine={false} // Removing tick line in recharts react => https://stackoverflow.com/questions/72517648/removing-tick-line-in-recharts-react
                axisLine={false} // https://stackoverflow.com/questions/62201747/remove-y-axis-line-but-keep-the-values-in-recharts
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                // tickFormatter 用法 => https://stackoverflow.com/questions/70055159/recharts-tickformatter-not-formatting-date
                tickFormatter={(tick) => formatXAxis(tick)}
              />
              {/* 設定滑鼠懸停時顯示的提示框。 */}
              <Tooltip content={<CustomTooltip />} />
              {/* <Legend /> */}
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="feels_like"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={false}
                strokeDasharray="12"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HourlyTemprature;
