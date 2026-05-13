import React from "react";
import ReactDOM from "react-dom/client";
import {  QueryClient,  QueryClientProvider,  useQuery  } from "@tanstack/react-query";

// Create Query Client
const queryClient = new QueryClient();

// API call
// Fetch with AbortSignal
const fetchTodos = async ({ signal }: { signal: AbortSignal }) => {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/todos",
    { signal } // 👈 important
  );

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  return res.json();
};


// Component
function App() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos
  });

  if (isLoading) return <h2>Loading...</h2>;
  if (isError) return <h2>Error: {(error as Error).message}</h2>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Todos</h1>

      {data.slice(0, 2000).map((todo: any) => (
        <div
          key={todo.id}
          style={{
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <strong>{todo.title}</strong>
          <p>Status: {todo.completed ? "✅ Completed" : "❌ Pending"}</p>
        </div>
      ))}
    </div>
  );
}

// Render
ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);