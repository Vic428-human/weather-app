import { ThemeProvider } from "@/context/theme-provider";

//也可以將BrowserRouter 換成 HashRouter 使用
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout";
import WeatherDashboard from "./pages/weather-dashboard";
import CityPage from "./pages/city-page";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Layout>
          <Routes>
            {/* Routes =>  http://molly1024.medium.com/%E6%96%B0%E7%89%88-react-router-%E6%80%8E%E9%BA%BC%E7%94%A8-react-router-dom-v6-8c0624642fce */}
            <Route element={<WeatherDashboard />} path={"/"}></Route>
            <Route element={<CityPage />} path="/city/:cityName"></Route>
          </Routes>
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
