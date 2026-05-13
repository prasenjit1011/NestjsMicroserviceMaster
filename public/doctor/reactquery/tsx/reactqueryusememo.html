import React, { useMemo, useCallback } from "react";
import ReactDOM from "react-dom/client";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

// ✅ Create Query Client
const queryClient = new QueryClient();

// ✅ API function
const fetchTodos = async (): Promise<any[]> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

// ✅ Memoized Child Component
type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

type TodoListProps = {
  todos: Todo[];
  onSelect: (todo: Todo) => void;
};

const TodoList = React.memo(({ todos, onSelect }: TodoListProps) => {
  console.log("Child render");

  return (
    <ul>
      {todos.map((todo) => (
        <li
          key={todo.id}
          onClick={() => onSelect(todo)}
          style={{ cursor: "pointer", marginBottom: "5px" }}
        >
          {todo.title}
        </li>
      ))}
    </ul>
  );
});

// ✅ Main App
const App: React.FC = () => {
  const { data = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    staleTime: 1000 * 60 * 5,
  });

  // ✅ useMemo (optimize filtering)
  const completedTodos = useMemo(() => {
    console.log("Filtering...");
    return data.filter((t: any) => t.completed);
  }, [data]);

  // ✅ useCallback (stable function reference)
  const handleSelect = useCallback((todo: Todo) => {
    alert(`Selected: ${todo.id}`);
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{(error as Error).message}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Todos</h2>

      <button onClick={() => refetch()}>Refetch</button>

      <TodoList todos={completedTodos} onSelect={handleSelect} />
    </div>
  );
};

// ✅ Root Render (your requested part)
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);