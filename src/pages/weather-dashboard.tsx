import WeatherSkeleton from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
// 有時候組件引用錯地方，例如 TriangleAlert 把它引用成其他套件，但其時其他套件並不存在，也會導致網頁畫面渲染失敗，產生空白畫面
import { RefreshCw, AlertCircle, MapPin, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGeoLocation } from "@/hooks/use-geolocation";
import {
  useForecastQuery,
  useReverseGerocodeQuery,
  useWeatherQuery,
} from "@/hooks/use-weather";
import CurrentWeather from "@/components/current-weather";
import HourlyTemprature from "@/components/hourly-temperature";
import WeatherDetails from "@/components/weatehr-details";
import WeatherForecast from "@/components/weather-forecast";

const WeatherDashboard = () => {
  // create custom hook for fetching my current location
  const {
    coordinates,
    error: locationError,
    isLoading: locationLoading,
    getLocation,
  } = useGeoLocation();

  // 用tanstack query的useQuery來抓取資料
  const locationQuery = useReverseGerocodeQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const currentWeatherQuery = useWeatherQuery(coordinates);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      locationQuery.refetch(); // 從 useQuery 返回的 refetch 可用於手動觸發查詢以進行數據獲取
      forecastQuery.refetch();
      currentWeatherQuery.refetch();
    }
  };

  if (locationLoading) {
    return <WeatherSkeleton />;
  }

  // chrome://settings/content/location?search=%E6%AC%8A%E9%99%90
  // 記得chrome的設定中需配置: 預設設定 > 網站會在你造訪時自動套用這項設定 >  網站可以要求取得你的位置資訊 勾選
  // 之前不確定什麼原因，會一直抓不到，導致回傳 Location information is unavailable 的錯誤訊息
  // AI說：CoreLocationProvider: CoreLocation framework reported a kCLErrorLocationUnknown failure，這通常是來自於蘋果裝置（iOS/macOS）的底層定位框架（CoreLocation），表示「目前無法取得定位資訊」。這個錯誤並不是你的 hook 寫法錯誤，而是裝置本身或環境導致定位資訊無法取得
  if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button variant="outline" onClick={getLocation} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable your location to get the weather.</p>
          <Button variant="outline" onClick={getLocation} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const locationName = locationQuery.data?.[0];

  // error / refetch/ isFetching 用法完整列表 =>  https://blog.csdn.net/m0_56504343/article/details/138488519
  // 針對 有座標位置，但是沒有正常從 api 取得資料的情況
  if (currentWeatherQuery.error || forecastQuery.error) {
    const errorMsg =
      currentWeatherQuery.error?.message || forecastQuery.error?.message;
    return (
      <Alert variant="destructive">
        <TriangleAlert />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          {/* React 只能渲染字符串、数字、React 元素等（即 ReactNode），不能直接渲染 Error 对象，需要将 Error 对象转换为字符串再渲染 */}
          {errorMsg && <p>失敗的原因: {errorMsg}</p>}
          <Button variant="outline" onClick={handleRefresh} className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // fetching的過程中
  if (!currentWeatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* favorite city  */}
      <div className="flex items-center justify-between">
        {/* tracking-tight
      letter-spacing: var(--tracking-tight); /* -0.025em */}
        <h1 className="text-xl font-medium tracking-tight">My Location</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={currentWeatherQuery.isFetching || forecastQuery.isFetching} // 變免選染中重複點擊
          className="w-fit"
        >
          {/* 對icon做動畫效果 => https://tailwindcss.com/docs/animation */}
          {/* fetching時 轉動icon */}
          <RefreshCw
            className={`h-4 w-4 ${
              currentWeatherQuery.isFetching || forecastQuery.isFetching
                ? "animate-spin"
                : ""
            } `}
          />
        </Button>
      </div>
      {/* get current and hourly weather */}
      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* current weather */}
          <CurrentWeather
            data={currentWeatherQuery.data}
            locationName={locationName}
          />
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
  );
};

export default WeatherDashboard;
