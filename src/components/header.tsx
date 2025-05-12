import { useTheme } from "@/context/theme-provider";
import { MessageSquare, Moon, Sun } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur py-2 supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between mx-auto h-16 px-4">
        <Link to="/">
          <img
            src={isDark ? "/logo2.png" : "/logo.png"}
            alt="klimate"
            className="h-14"
          />
        </Link>
        <div>
          {/* search */}

          {/* theme toggle  */}
          <div
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`flex items-center cursor-pointer transition-transform duration-500 ${
              isDark ? "rotate-180" : "rotate-0"
            }`}
          >
            {/* https://blog.csdn.net/gu19880609/article/details/145925854 */}
            {/* rotate 类用于设置元素的旋转角度，可以是正角度（顺时针）或负角度（逆时针）。  */}
            {isDark ? (
              <Sun className="w-6 h-6 text-yellow-500 rotate-0 transition－all" />
            ) : (
              <Moon className="w-6 h-6 text-blue-500 rotate-0 transition-all " />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
