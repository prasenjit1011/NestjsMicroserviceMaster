import React from "react";
import ReactDOM from "react-dom/client";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

// ✅ Create client
const queryClient = new QueryClient();

// ✅ Type for API response
type User = {
  id: number;
  name: string;
  email: string;
};

// ✅ Fetch function
const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

// ✅ Component using React Query
function Users() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div>
      <h2>Users List</h2>

      <button onClick={() => refetch()}>Refetch</button>

      <ul>
        {data?.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ✅ App wrapper
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Users />
    </QueryClientProvider>
  );
}

// ✅ React 18 root
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);