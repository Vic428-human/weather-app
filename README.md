## 2025 年 6/2 前短期目標

- [expense tracker app](https://github.com/Vic428-human/expense-tracker-app) 原先 2025/4 月下旬是寫 react native 的 side project，
  因為原先預計是找 手機開發的工作，但後來錄取的是網頁開發，所以稍微改一下當前的學習進度。加減學一些 tanstack-query 跟 tailwind，方便下一份工作到職後好銜接一點。

## React + TypeScript + Vite Getting Start

0. node -v

```bash
nvm use 18 // version 18
npm i
npm run dev
```

- [shadcn/ui](https://ui.shadcn.com/docs/installation/vite) 使用 shadcn/ui 初始化的時候會操作的內容

0. add button 也可以 add 其他組件

## CodeBase 架構說明

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

- [npx shadcn@latest add card](https://ui.shadcn.com/docs/components/card)
  src/components/ui 路徑底下的組件都是透過此方式自動生成的
