import React from "react";
import ReactDOM from "react-dom/client";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

// ✅ Type
type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

const queryClient = new QueryClient();

// ✅ Fetch with AbortController (via signal)
const fetchTodos = async ({
  signal,
}: {
  signal?: AbortSignal;
}): Promise<Todo[]> => {
  try {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/todos",
      { signal } // 👈 important
    );

    if (!res.ok) {
      throw new Error("Failed to fetch todos");
    }

    return await res.json();
  } catch (error: any) {
    // ✅ Handle abort separately (optional but clean)
    if (error.name === "AbortError") {
      console.log("Request cancelled");
    }
    throw error;
  }
};

const App: React.FC = () => {
  const { data, isLoading, isError, error, refetch } = useQuery<
    Todo[],
    Error
  >({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <h2>Loading...</h2>;

  if (isError)
    return (
      <div>
        <h2>Error: {error.message}</h2>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Todos List</h1>
      <ul>
        {data?.slice(0, 20).map((todo) => (
          <li key={todo.id}>
            {todo.title} {todo.completed ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);