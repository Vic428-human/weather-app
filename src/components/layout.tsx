import type { ReactNode } from "react";

// import { type PropsWithChildren } from "react"; =>> PropsWithChildren referring to @types/react，有隱憂
type PropsWithOptionalChildren<P = unknown> = P & { children?: ReactNode }; // 所以直接自己定義即可

// 網頁通常都會有一個固定版面的佈局，這就是最大的Layout components => https://medium.com/@katytsai.git/react-components-%E7%9A%84layout%E8%A6%8F%E5%8A%83-602ad45b13c8
// 通常有Header 、Sidebar、 Footer、及不同的內容頁所組成
const Layout = ({ children }: PropsWithOptionalChildren) => {
  // children => React.ReactNode 會錯誤，發生在如果 jsx 的 children 沒有實際傳進來的時候
  // 這是因為 PropsWithChildren 的型別是從 @types/react 所造成的問題
  // https://dev.to/maafaishal/unsafe-propswithchildren-utility-type-in-react-typescript-app-3bd3
  return (
    // muted/1 => https://stackoverflow.com/questions/77180187/tailwindcss-from-muted-10-from-10-to-muted-30-to-50
    // bg-primary-muted => would set the background color to the new color.
    <div className="bg-gradient-to-br from-background to-muted/10">
      {/* <Header /> */}
      {/* min-h-screen 作用是将元素的最小高度设置为与视口高度相同 */}
      <main className="min-h-screen container mx-auto px-4 py-8">
        {children}
      </main>
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
      </footer>
      ;{/* <Footer /> */}
    </div>
  );
};

export default Layout;
