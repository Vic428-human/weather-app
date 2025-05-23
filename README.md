## 2025 年 6/2 前短期目標[已於 05/24 完成]

- 2025/5/24 更新： 目前此 side project 已完成，短時間內不會再更新，下一階段專案進度為 [訂閱追蹤的 API 架構規劃](https://github.com/Vic428-human/subscription-tracker-nodejs-api-architecture)
- [expense tracker app](https://github.com/Vic428-human/expense-tracker-app) 4 月下旬進度

## 畫面示意圖

![當前所在地的氣候](https://github.com/Vic428-human/weather-app/blob/9da760d18511d7b30f8d4989b2436a50471fbfaa/currentLocation.png)
![某個特定城市的氣候](https://github.com/Vic428-human/weather-app/blob/9da760d18511d7b30f8d4989b2436a50471fbfaa/cityName.png)

## React + TypeScript + Vite Getting Start

0. node -v

```bash
nvm use 18 // version 18
npm i
npm run dev
```

## CodeBase 架構說明

### 比較 number 跟 parseFloat 的使用上差異

```
src/pages/city-page.tsx
```

### 規劃 添加歷史訊息跟清理歷史訊息的邏

說明：

1. historyQuery: 透過 tanstack query 獲取歷史訊息，預設是空陣列，之後會被動的因為 addHistory 跟 clearHistory 這兩個 useMutation 觸發而跟著更新。
2. 透過 useMutation 製作的 addHistory 跟 clearHistory 歷史訊息更新功能，歷史訊息透過 useLocalStorage 這個 useHook，把更新後的內容，存在本地端，然後同樣透過 useLocalStorage 回傳新的 state(history) 。 historyQuery 這個 useQuery 就會獲取新的 history 的內容。
3. 因為 addHistory 跟 clearHistory 這兩個 useMutation 的觸發，讓值得以更新，
   再藉著 tanstack 的 useQuery 緩存機制，節省資源，避免重複渲染，如有變化，則重新拉取更新後的內容。

```
src/hooks/use-seatch-history.ts
```

### 規劃 localStorage 的 set 跟 get 在 useHook

說明： 可以被重複調用

```
src/hooks/use-local-storage.ts
```

### 獲取座標地址核心

說明：透過 navigator.geolocation.getCurrentPosition ，讓使用者根據 custom hook 定義好的內容，對座標地址錯誤訊息，跟刷新座標地址做處理

```
src/hooks/use-geolocation.tsx
```

### 與氣候 API 交互的核心邏輯

說明： 用 class 的方式去定義，在大型專案中，方便維護的人直接調用，跟迭代

```
src/api/weather.ts
```

### 不同的 footer 風格

```js
/* 精簡版Footer */
<footer className="border-t backdrop-blur py-12">
  <div className="container mx-auto px-4 text-center text-gray-400">
    <p>© 2025 Made with ❤️ by popcornman !!</p>
  </div>
</footer>;

/* 比較常規的Footer */
<footer className="border-top backdrop-blur bg-white rounded-lg shadow-sm m-4 dark:bg-gray-800">
  <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
      © 2025 Made with ❤️ by popcornman !!
    </span>
    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
      <li>
        <a className="hover:underline me-4 md:me-6">About</a>
      </li>
      <li>
        <a className="hover:underline me-4 md:me-6">Privacy Policy</a>
      </li>
      <li>
        <a className="hover:underline me-4 md:me-6">Licensing</a>
      </li>
      <li>
        <a className="hover:underline">Contact</a>
      </li>
    </ul>
  </div>
</footer>;
```

### src/components/ui 裡面組件的由來

```tsx
// 透過 npx shadcn@latest add button

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
```

說明： add button 也可以 add 其他組件，例如 Card

src/components/ui 路徑底下的組件都是透過此方式自動生成的

- [npx shadcn@latest add card](https://ui.shadcn.com/docs/components/card)

使用 shadcn/ui 初始化的時候會操作的內容

- [shadcn/ui](https://ui.shadcn.com/docs/installation/vite)
