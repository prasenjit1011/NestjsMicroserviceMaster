import React, { useState, useMemo, useCallback, CSSProperties } from "react";
import ReactDOM from "react-dom/client";

// ✅ Properly typed styles
const style: Record<string, CSSProperties> = {
  parent: { border: "1px solid #F00", padding: 10 },
  child: { border: "1px solid #00F", paddingTop: 5, marginTop: 10 },
  title: { textAlign: "center" },
  btn1: { cursor: "pointer" },
  btn2: {padding: "5px",marginLeft: "27px",backgroundColor: "#5DF8D8",cursor: "pointer"},
  list: { padding: "5px", listStyleType: "none" }
};

const items: string[]   = ["apple","mango","orange","grape","WaterMelon","Coconut"];
type ListProps          = {  items: string[];  callbackFn: (value?: string) => void;};

const List = React.memo(({ items, callbackFn }: ListProps) => {
  return (
    <div style={style.child}>
      <p style={style.title}>React.memo</p>
      <button onClick={() => callbackFn()} style={style.btn2}>Clear Search</button>
      <p>Render Time : {new Date().toLocaleTimeString()}</p>
      {items.length > 0 ? (
        items.map((i, index) => (
          <p key={index} onClick={() => callbackFn(i)}>
            {index + 1}) {i.toUpperCase()}
          </p>
        ))
      ) : (
        <p>Data Not Found!</p>
      )}
    </div>
  );
});

function App() {
  const [count, setCount] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  

  // ✅ Stable callback
  const callbackFn = useCallback((value?: string) => {setSearch(value || "");}, []);

  // ✅ Fixed dependency issue
  const filteredItems = useMemo(() => { return items.filter((i) =>  i.toLowerCase().includes(search.toLowerCase()));}, [search, items]);

  return (
    <div style={style.parent}>
      <p style={style.title}>useCallback and useMemo</p>
      <input onChange={(e: React.ChangeEvent<HTMLInputElement>) =>   setSearch(e.target.value)}  value={search} placeholder="Search..." />
      <button  onClick={() => setCount((c) => c + 1)}  style={style.btn1}>Increment ({count})</button>
      <List items={filteredItems} callbackFn={callbackFn} />
    </div>
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