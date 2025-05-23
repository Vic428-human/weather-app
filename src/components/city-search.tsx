import { useState } from "react";
import { Search, Loader2, XCircle, Clock } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import { useLocationSearch } from "@/hooks/use-weather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/use-seatch-history";
import { format } from "date-fns";

const CitySeatch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: locations, isLoading } = useLocationSearch(query);
  const { history, addHistory, clearHistory } = useSearchHistory();

  // <Route element={<CityPage />} path="/city/:cityName"></Route>
  // 之前有定義過另一個router頁面，:cityName 這就是接下來要取得的 params
  const navigate = useNavigate();

  // 每當搜尋某個城市的時候，之後都會暫存到本地端 localStorage，
  // 透過 addHistory.mutate 去觸發 useSearchHistory 裡的 tanstack query 跟 useMutation
  const handleSelectChange = (cityData: string) => {
    // cityData===> 22.2793278|114.1628131|Hong Kong Island|CN
    // 之前用 | 分隔，現在透過 | 來split 出數據
    const [lat, lon, name, country] = cityData.split("|");

    addHistory.mutate({
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      name,
      country,
      query,
    });

    // 把一些特定params資訊帶給某個新的頁面，這部分的params是動態刷新的
    navigate(`/city/${name}??lat=${lat}&lon=${lon}&country=${country}`); // 例如： 搜尋 new taipei => New%20Taipei??lat=25.012&lon=121.45 => %20 === 空格
  };
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        // 在不同的RWD模式，調整按鈕組件不同 width
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-60"
      >
        <Search className="mr-2 h-4 w-4" />
        Search Cities
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search Cities"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {/* 查詢的關鍵字不存在時 */}
          {query.length > 2 && !isLoading && (
            <CommandEmpty>No Cities found.</CommandEmpty>
          )}

          {/* 實際有查詢過的歷史紀錄 */}
          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between px-2 my-2">
                  <p className="text-xs text-muted-foreground">最近搜尋紀錄:</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearHistory.mutate()}
                  >
                    <XCircle className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </CommandGroup>

              {history.map((location) => {
                return (
                  <CommandItem
                    // https://github.com/shadcn-ui/ui/issues/889
                    key={`${location.lat}-${location.lon}`}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    // Instead of depending on the onSelect val, just use the value from .map
                    // handleSelectChange 傳遞的參數會是先前 CommandItem 的 value
                    onSelect={handleSelectChange}
                  >
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      地區：{location.name}
                    </span>

                    {/* 哪一州 */}
                    {location.state && (
                      <span className="text-sm text-muted-foreground">
                        , 州： {location.state}
                      </span>
                    )}
                    {/* 哪一國 */}
                    <span className="text-sm text-muted-foreground">
                      , 國家：{location.country}
                    </span>

                    <span className="ml-auto text-xs text-muted-foreground">
                      最近查詢 :{" "}
                      {format(new Date(location.searchedAt), "MM-dd HH:mm:ss")}
                    </span>
                  </CommandItem>
                );
              })}
            </>
          )}

          {/* 當前正在搜尋的時候顯示有關的地區列表 */}
          <CommandSeparator />
          {locations && locations.length > 0 && (
            <CommandGroup heading="Suggestions">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {locations.map((location) => {
                return (
                  <CommandItem
                    // https://github.com/shadcn-ui/ui/issues/889
                    key={`${location.lat}-${location.lon}`}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    // Instead of depending on the onSelect val, just use the value from .map
                    // handleSelectChange 傳遞的參數會是先前 CommandItem 的 value
                    onSelect={handleSelectChange}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    <span className="text-sm text-muted-foreground">
                      地區：{location.name}
                    </span>

                    {/* 哪一州 */}
                    {location.state && (
                      <span className="text-sm text-muted-foreground">
                        , 州： {location.state}
                      </span>
                    )}
                    {/* 哪一國 */}
                    <span className="text-sm text-muted-foreground">
                      , 國：{location.country}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CitySeatch;
