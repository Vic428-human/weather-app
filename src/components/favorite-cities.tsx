import { useFavorite } from "@/hooks/use-favoriate";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useWeatherQuery } from "@/hooks/use-weather";
import { Button } from "./ui/button";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface FavoriteCityTabletProps {
  id: string;
  name: string;
  lat: number;
  lon: number;
  onRemove: (id: string) => void; // 這代表這個函數執行完之後「不會有回傳值」。
}

const FavoriteCities = () => {
  const { favorites, removeFavorite } = useFavorite();

  if (!favorites.length) return null;

  return (
    <>
      {/* https://ui.shadcn.com/docs/components/scroll-area */}
      <h1 className="flex  text-xl text-bold tracking-tight">
        <svg
          className="h-[1lh] w-5.5 shrink-0"
          viewBox="0 0 22 22"
          fill="none"
          stroke-linecap="square"
        >
          <circle cx="11" cy="11" r="11" className="fill-sky-400/25" />
          <circle cx="11" cy="11" r="10.5" className="stroke-sky-400/25" />
          <path
            d="M8 11.5L10.5 14L14 8"
            className="stroke-sky-800 dark:stroke-sky-300"
          />
        </svg>
        <p className="ml-2">Favorites</p>
      </h1>
      <ScrollArea className="w-full pb-4">
        {/* 會有好幾筆，要把每一筆已經存在於favorites中的氣候都顯示出來 */}
        {/* 1. 會透過 經緯度查詢對應氣候*/}
        {/* 2. 判斷該個favorite是否正在進行加載 */}
        <div className="flex gap-4">
          {favorites.map((city) => {
            return (
              <FavoriteCityTablet
                key={city.id}
                {...city}
                onRemove={() => removeFavorite.mutate(city.id)}
              />
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="mt-2" />
      </ScrollArea>
    </>
  );
};

function FavoriteCityTablet({
  id,
  name,
  lat,
  lon,
  onRemove,
}: FavoriteCityTabletProps) {
  // 要進入某個頁面的起手，可參考 city-search.tsx 的做法
  const navigate = useNavigate();
  //  const currentWeatherQuery = useWeatherQuery(coordinates);
  //  過往會用這個方式取得值 currentWeatherQuery.data
  // 一、data是後端成功返回的數據，第一次的值為undefined
  // 二、isLoading是指數據是否正在加載的狀態，通常用於判斷請求是否還在進行中。當isLoading為true時，表示數據正在加載中，當isLoading為false時，表示數據加載完成。
  // 三、isFetching是指數據是否正在進行更新的狀態，通常用於判斷數據是否正在進行更新操作，比如重新加載數據或者刷新數據。當isFetching為true時，表示數據正在進行更新操作，當isFetching為false時，表示數據更新操作完成。
  const { data: weather, isLoading } = useWeatherQuery({ lat, lon });

  //  點選個別的我的最愛的城市，會跳到該城市的天氣頁面
  return (
    <div
      onClick={() => navigate(`/city/${name}?lat=${lat}&lon=${lon}`)}
      role="button"
      //   isFocusable，其值如果是 true 時表示我們可透過鍵盤的 tab 鍵聚焦到這個元素上
      tabIndex={0} // 設置為 0 可以讓本來不可獲取焦點的元素變為可聚焦元素
      // adding cross btn inside of this div
      className="relative flex min-w-[250px] cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-md"
    >
      {/* --destructive: oklch(0.577 0.245 27.325); */}
      {/* We use a simple background and foreground convention for colors. The background variable is used for the background color of the component and the foreground variable is used for the text color. */}
      {/* group-hover 如果我們希望在父元素懸停時，控制子元素的樣式變化 */}
      {/* group-hover => https://blog.csdn.net/2501_91107759/article/details/147378671 */}
      <Button
        className="absolute w-6 h-6 right-1 top-1 rounded-full p-0 text-destructive-foreground group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
          toast.error(`Removed ${name} from Favorites`);
        }}
      >
        <X className="h-4 w-4 text-red-600 " />
      </Button>
      {isLoading ? (
        <div className="flex h-8 items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : weather ? (
        <div className="flex items-center gap-2">
          <img
            className="h-8 w-8"
            alt={weather.weather[0].description}
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          />
          <div>
            <p className="font-medium">{weather.name}</p>
            <p className="text-xs font-muted-foreground">
              {weather.sys.country}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xl font-bold">{weather.main.temp}</p>
            <p className="text-xs capitalize font-muted-foreground">
              {weather.weather[0].description}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default FavoriteCities;
