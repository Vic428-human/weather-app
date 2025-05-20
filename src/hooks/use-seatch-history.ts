// 當前的hook 可以調用 另一個hook 來獲取資料
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "./use-local-storage";

interface SearchHistoryItem {
    id:string;
    query: string; 
    lat:number;
    lon:number;
    name:string;
    country:string;
    state?:string;
    searchedAt:number;
}
export function useSearchHistory(){
    const [history, setHistory] = useLocalStorage<SearchHistoryItem[]>('search-history',[])

    const historyQuery = useQuery({
        queryKey:['search-history'],
        queryFn:() => history, // 一個 function 回傳一個 Promise 物件，必須 resolve 回傳 data 或是 throw error，data 不能是 undefined。
        initialData: history, // Provide initialData to a query to prepopulate its cache if empty
    })

    const clearHistoryItem = async() => {
      setHistory([]);
      return [];
    }

    const searchHistoryItem = async(search: Omit<SearchHistoryItem,'id'| 'searchedAt'>) => {
        
        // 當前查詢的搜尋內容
        const newSearch : SearchHistoryItem = {
          ...search,
          id: `${search.lat}-${search.lon}-${new Date()}`,
          searchedAt: Date.now(),
        }

        // 不包含當前最新內容，只找出歷史紀錄
        // 透過座標經緯度來判斷，如果新的經緯度跟歷史紀錄的經緯度不同，則代表是舊的
        const prevHistory = history.filter((item)=> !(item.lat === search.lat && item.lon === search.lon))

        // 新的一筆＋過往歷史紀錄 = 新的歷史紀錄 (包含現在跟過去歷史紀錄)，因為對於下一筆新紀錄來說，這些都會是過去的歷史紀錄
        const newHistory = [newSearch,...prevHistory].slice(0,10)
        setHistory(newHistory)

        // Return context with the newHistory
        return newHistory;
    }

    const queryClient = new QueryClient()
      // useMutation：用於處理資料的建立、更新或刪除操作。它不會快取結果，而是主要用於觸發變化。
      // 特性：觸發式操作、內建狀態管理、與快取結合
      // https://tanstack.com/query/latest/docs/framework/react/guides/mutations
    const addHistory = useMutation({
        mutationFn: async (search: Omit<SearchHistoryItem, "id" | "searchedAt">) => await searchHistoryItem(search),
        onSuccess: (newHistory, variables, context) => {
          // Replace the search-history with the newHistory
          queryClient.setQueryData(['search-history'], newHistory)
        },
      })

    const clearHistory = useMutation({
      mutationFn: async () => clearHistoryItem,
      onSuccess: (newHistory, variables, context) => {
        // Replace the search-history with the newHistory
        queryClient.setQueryData(['search-history'], newHistory)
      },
    })

    return  {
      history: historyQuery.data || [], 
      addHistory,
      clearHistory
    }
}   


