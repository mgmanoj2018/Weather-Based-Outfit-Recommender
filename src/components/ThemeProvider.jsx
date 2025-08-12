import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "system",
  setTheme: () => {},
});

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-ui-theme", ...props }) {
  // keep internal setter name separate
  const [theme, setThemeState] = useState(() => localStorage.getItem(storageKey) || defaultTheme);

  // apply theme to documentElement and watch system changes
  useEffect(() => {
    const root = window.document.documentElement;

    const apply = (t) => {
      root.classList.remove("light", "dark");
      if (t === "system") {
        const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.add(systemIsDark ? "dark" : "light");
      } else {
        root.classList.add(t);
      }
    };

    apply(theme);

    // listen for system theme changes
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") apply("system");
    };

    if (mql.addEventListener) mql.addEventListener("change", handler);
    else mql.addListener(handler);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler);
      else mql.removeListener(handler);
    };
  }, [theme]);

  const setTheme = (newTheme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }} {...props}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
