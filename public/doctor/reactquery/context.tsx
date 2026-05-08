import React from "react";
import ReactDOM from "react-dom/client";
import { createContext, useContext, useState } from "react";


type Theme = "light" | "dark";
type ThemeContextType = {  theme: Theme;  toggleTheme: () => void; };
const ThemeContext    = createContext<ThemeContextType | undefined>(undefined);

const App = () => {
  const [theme, setTheme] = useState<Theme>("light");
  const toggleTheme = () => { setTheme((prev) => (prev === "light" ? "dark" : "light")); };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Page />
      <NewPage />
    </ThemeContext.Provider>
  );
}

/* ---------------- Child Component ---------------- */
const Page = () => {
  const context = useContext(ThemeContext);
  if (!context) { throw new Error("Page must be used inside ThemeContext.Provider"); }
  const { theme, toggleTheme } = context;

  return (
    <>
      <h1>useContext Demo</h1>
      <p>Current Theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </>
  );
}

const NewPage = () => {
  const context = useContext(ThemeContext);

  if (!context) { throw new Error("NewPage must be used inside ThemeContext.Provider"); }
  const { theme, toggleTheme } = context;

  return (
    <>
      <h1>useContext Demo NewPage</h1>
      <p>Current Theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </>
  );
}

// ============================
// React 18 Root
// ============================
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);