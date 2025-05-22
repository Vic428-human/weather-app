// rendering favorites in our search and in our dashboard
// 當前的hook 可以調用 另一個hook 來獲取資料
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";

interface FavoriteCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  addedAt: number;
}
export function useFavorite() {
  const [favorites, setFavorites] = useLocalStorage<FavoriteCity[]>(
    "favorites",
    []
  );
  //   the QueryClient has an invalidateQueries method that lets you intelligently mark queries as stale and potentially refetch them too
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: () => favorites, // 一個 function 回傳一個 Promise 物件，必須 resolve 回傳 data 或是 throw error，data 不能是 undefined。
    initialData: favorites, // Provide initialData to a query to prepopulate its cache if empty
    // https://github.com/TanStack/query/discussions/1685
    staleTime: Infinity, // StaleTime 就是資料「保持新鮮」的時間。在這段時間內，都會直接從快取拿資料，不會連網更新。一旦過了這個時間，雖然還是會先顯示舊資料，但會偷偷去檢查有沒有新資料可以更新。
    // invalidateQueries 在TanStack Query (React Query) 中用於將特定的查詢或所有查詢標記為過時，進而強制重新獲取數據。 這對於確保應用程式中的數據保持最新和一致至關重要，尤其是在有Mutation（修改）操作發生後，或者需要更新部分查詢數據的時候
    // 相較於直接更新Cache，invalidateQueries 可以更精確地控制需要重新拉取數據的範圍。 例如，可以只將特定的查詢標記為過時，而不是整個Cache.
  });

  // useMutation：用於處理資料的建立、更新或刪除操作。它不會快取結果，而是主要用於觸發變化。
  // 特性：觸發式操作、內建狀態管理、與快取結合
  // https://tanstack.com/query/latest/docs/framework/react/guides/mutations
  const addFavorite = useMutation({
    mutationFn: async (city: Omit<FavoriteCity, "id" | "addedAt">) =>
      await searchCityItem(city),
    onSuccess: () => {
      // 當調用 invalidateQueries 方法時，它會將查詢的 isFetching 屬性設置為 true，表示當前查詢正在獲取最新數據。然後，在數據獲取完成後，isFetching 屬性會被重置為 false
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  // trigger mutation 在 devtool 裡的 mutation 也會看到 log紀錄
  const removeFavorite = useMutation({
    mutationFn: async (cityId: string) => {
      const newFavorites = favorites.filter((fav) => fav.id !== cityId);
      setFavorites(newFavorites);
      return newFavorites;
    },
    onSuccess: () => {
      queryClient.setQueryData(["search-history"], []);
    },
  });

  const searchCityItem = async (city: Omit<FavoriteCity, "id" | "addedAt">) => {
    // 當前查詢的搜尋內容
    const newFavorite: FavoriteCity = {
      ...city, // 看  addHistory.mutate 傳了什麼過來
      id: `${city.lat}-${city.lon}`,
      addedAt: Date.now(), // 抓的是當前這個時區的時間
    };

    // 判斷新增的 favorite 是否已經存在
    const exists = favorites.some((fav) => fav.id === newFavorite.id);

    if (exists) return favorites;

    const newFavorites = [...favorites, newFavorite].slice(0, 10);

    setFavorites(newFavorites);

    // Return context with the newHistory
    return newFavorites;
  };

  return {
    favorites: favoritesQuery.data,
    addFavorite,
    removeFavorite,
    // 用一個 arrow function 傳遞經緯度參數，去判斷當下的 經緯度 是否是 我的最愛，例如我知道當下的經緯度，然後要看之前這個經緯度是不是已經加到我的最愛(favorites)這個數組裡
    ifFavorite: (lat: number, lon: number) =>
      favorites.some((fav) => fav.lat === lat && fav.lon === lon),
  };
}
