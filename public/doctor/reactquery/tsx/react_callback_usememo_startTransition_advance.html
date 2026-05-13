import ReactDOM from "react-dom/client";
import React, {  useEffect,  useState,  useMemo,  useCallback,  startTransition,  } from "react";

type Todo = {  userId: number;  id: number;  title: string;  completed: boolean; };

// const url = "https://jsonplaceholder.typicode.com/todos";
const url = "http://localhost:3000/api/users";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {  fetch(url) .then((res) => res.json())  .then((data: Todo[]) => setTodos(data));  }, []);


  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => todo.title.toLowerCase().includes(search.toLowerCase()));
  }, [todos, search]);

  // 3. useCallback → stable handler reference
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // HIGH PRIORITY (instant UI update)
      setInput(value);

      // LOW PRIORITY (React Fiber scheduling)
      startTransition(() => {  setSearch(value);  });
    },
    []
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>Advanced Production Search (React Fiber + Hooks)</h2>
      <input  value={input}  onChange={handleChange}  placeholder="Search todos..."  style={{  padding: 10,  width: 300,  marginBottom: 20,  }}  />
      <p>Total Results: {filteredTodos.length}</p>

      <div  style={{  height: 400,  overflow: "auto",  border: "1px solid gray",  padding: 10,  }}      >
        {filteredTodos.map((todo, index) => (
          <div  key={index}  style={{  padding: 6,  borderBottom: "1px solid #eee",  }}  >
            {index + 1}.
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