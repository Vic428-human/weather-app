import CurrentWeather from "@/components/current-weather";
import FavoriteButton from "@/components/favorite-button";
import HourlyTemprature from "@/components/hourly-temperature";
import WeatherSkeleton from "@/components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import WeatherDetails from "@/components/weatehr-details";
import WeatherForecast from "@/components/weather-forecast";
import { useForecastQuery, useWeatherQuery } from "@/hooks/use-weather";
import { AlertTriangle } from "lucide-react";
import { useSearchParams, useParams } from "react-router-dom"; //  read and modify the query string in the URL for the current location.

const CityPage = () => {
  // uses the useSearchParams to access the queryString and return a constructed URLSearchParams object which can then access individual query params
  const [searchParams] = useSearchParams();

  // Get the userId param from the URL.
  const params = useParams();

  // parseFloat() => 從字串的開頭開始解析，遇到第一個無效的浮點字元就停止。例如，parseFloat("123.45abc") 回傳 123.45，parseFloat("abc123") 回傳 NaN
  // 只支援十進位，不支援十六進位（如 parseFloat("0xA") 回傳 0）
  // 只處理第一個小數點，後續的小數點及其之後的內容會被忽略。例如，parseFloat("22.3.56") 回傳 22.3
  // 經緯度會有小數點，所以要用 parseFloat 比較合適
  // 為什麼不適合用 Number()？只要字串中有非數字字元，Number() 就會回傳 NaN
  // 空字串會被 Number() 轉成 0。例如，Number("") 回傳 0，但 parseFloat("") 回傳 NaN。經緯度為空時，回傳 0 可能導致地圖定位到赤道或本初子午線，產生嚴重的定位錯誤
  // Number() 不容忍字串中的格式錯誤。例如，Number(" 22.3 56 ") 回傳 NaN，但 parseFloat("22.3 56") 回傳 22.3 => 相較之下 parseFloat 容錯率比較高

  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");
  const country = searchParams.get("country");

  const coordinates = { lat, lon };

  // 知道座標後，就能跟之前一樣，從 tanstack query 方式調用API的回傳數據了
  const forecastQuery = useForecastQuery(coordinates);
  const currentWeatherQuery = useWeatherQuery(coordinates);

  if (currentWeatherQuery.error || forecastQuery.error) {
    const errorMsg =
      currentWeatherQuery.error?.message || forecastQuery.error?.message;

    return (
      <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          {/* React 只能渲染字符串、数字、React 元素等（即 ReactNode），不能直接渲染 Error 对象，需要将 Error 对象转换为字符串再渲染 */}
          {errorMsg && <p>失敗的原因: {errorMsg}</p>}
        </AlertDescription>
      </Alert>
    );
  }

  // cityName 的原因是 => <Route element={<CityPage />} path="/city/:cityName"></Route> 傳進來的第一個參數就是
  if (!currentWeatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />;
  }

  return (
    <div>
      <div className="space-y-4">
        {/* favorite city  */}
        <div className="flex items-center justify-between">
          {/* tracking-tight
      letter-spacing: var(--tracking-tight); /* -0.025em */}
          <h1 className="text-pink-300 font-medium tracking-tight text-3xl">
            所在城市：{params.cityName}, 所在國家：{country}
          </h1>
          {/* favorite button */}
          <div>
            <FavoriteButton
              data={{ ...currentWeatherQuery.data, name: params.cityName }}
            />
          </div>
        </div>
        {/* get current and hourly weather */}
        <div className="grid gap-6">
          <div className="flex flex-col gap-6">
            {/* current weather */}
            <CurrentWeather data={currentWeatherQuery.data} />
            {/* hourly temperature */}
            <HourlyTemprature data={forecastQuery.data} />
          </div>
          {/* items-start => 往上垂直對齊 */}
          <div className="gap-6 grid md:grid-cols-2 items-start">
            {/* details */}
            <WeatherDetails data={currentWeatherQuery.data} />
            {/* forecast 抓得是除了今天以及未來五天的氣候預報*/}
            <WeatherForecast data={forecastQuery.data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityPage;
