import WeatherSkeleton from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";

import { RefreshCw, AlertCircle, MapPin } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGeoLocation } from "@/hooks/use-geolocation";
import {
  useForecastQuery,
  useReverseGerocodeQuery,
  useWeatherQuery,
} from "@/hooks/use-weather";

const WeatherDashboard = () => {
  // create custom hook for fetching my current location
  const {
    coordinates,
    error: locationError,
    isLoading: locationLoading,
    getLocation,
  } = useGeoLocation();

  // 用tanstack的useQuery來抓取資料
  const locationQuery = useReverseGerocodeQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const currentWeatherQuery = useWeatherQuery(coordinates);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      locationQuery.refetch();
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

  const locationName: string = Array.isArray(locationQuery.data)
    ? locationQuery.data[0]?.name
    : "";
  console.log("locationName", locationName);

  return (
    <div className="space-y-4">
      {/* favorite city  */}
      <div className="flex items-center justify-between ">
        {/* tracking-tight
      letter-spacing: var(--tracking-tight); /* -0.025em */}
        <h1 className="text-xl font-medium tracking-tight">My Location</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          // disabled={false}
          className="w-fit"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>
      {/* get current and hourly weather */}
    </div>
  );
};

export default WeatherDashboard;
