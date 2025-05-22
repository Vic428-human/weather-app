import { ThemeProvider } from "@/context/theme-provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import WeatherDashboard from "./pages/weather-dashboard";
import CityPage from "./pages/city-page";
// 如果我們既不想要每次使用非同步狀態都彈出一個 loading 阻擋使用者操作，
// 又不想自己手動管理複雜的非同步狀態的話 Cache 管理 / 輪詢 / 分頁快取 / 自動重載 / 無限滾動 / 視窗聚焦自動重載 / 離線資料 / 失敗重試
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// 開發者工具來幫助調試快取
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";

function App() {
  // Create a client
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Layout>
            <Routes>
              {/* Routes =>  http://molly1024.medium.com/%E6%96%B0%E7%89%88-react-router-%E6%80%8E%E9%BA%BC%E7%94%A8-react-router-dom-v6-8c0624642fce */}
              <Route element={<WeatherDashboard />} path={"/"}></Route>
              <Route element={<CityPage />} path="/city/:cityName"></Route>
            </Routes>
          </Layout>
          <Toaster richColors toastOptions={{}} />
        </ThemeProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
