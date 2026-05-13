import ReactDOM from "react-dom/client";
import React, { useEffect, useState, startTransition } from "react";



type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};
// const url = "https://jsonplaceholder.typicode.com/todos";
const url = "http://localhost:3000/api/users";
export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Todo[]>([]);

  // Fetch data from API
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data: Todo[]) => {
        setTodos(data);
        setFiltered(data);
      });
  }, []);

  // Search with React Fiber priority
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // HIGH PRIORITY (urgent UI update)
    setSearch(value);

    // LOW PRIORITY (expensive filtering)
    startTransition(() => {
      const result = todos.filter((todo) =>
        todo.title.toLowerCase().includes(value.toLowerCase())
      );

      setFiltered(result);
    });
  };

  let slno = 1;

  return (
    <div style={{ padding: 20 }}>
      <h2>React Fiber + TypeScript + startTransition</h2>

      <input
        value={search}
        onChange={handleSearch}
        placeholder="Search todos..."
        style={{
          padding: 10,
          width: 300,
          marginBottom: 20,
        }}
      />

      <p>Total Todos: {filtered.length}</p>

      <div
        style={{
          height: 400,
          overflow: "auto",
          border: "1px solid #ccc",
          padding: 10,
        }}
      >
        {filtered.map((todo, index) => (
          <div
            key={index}
            style={{
              padding: 5,
              borderBottom: "1px solid #eee",
            }}
          >
            {slno++}.
            {todo.title}
          </div>
        ))}
      </div>
    </div>
  );
}



const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);