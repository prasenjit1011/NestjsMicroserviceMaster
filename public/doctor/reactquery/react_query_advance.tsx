import React from "react";
import ReactDOM from "react-dom/client";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

// -----------------------------------
// TYPES
// -----------------------------------
type User = {
  id: number;
  name: string;
  email: string;
};

// -----------------------------------
// API FUNCTIONS
// -----------------------------------

// GET USERS
const getUsers = async (): Promise<User[]> => {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/users"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};

// ADD USER
const addUser = async (): Promise<User> => {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/users",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "New User",
        email: "newuser@gmail.com",
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add user");
  }

  return response.json();
};

// -----------------------------------
// COMPONENT
// -----------------------------------
const Users: React.FC = () => {
  const queryClient = useQueryClient();

  // -----------------------------------
  // useQuery -> GET API + CACHE
  // -----------------------------------
  const {
    data,
    error,
    isLoading,
    refetch,
  } = useQuery<User[]>({
    queryKey: ["users"], // cache key
    queryFn: getUsers,   // fetch function
    staleTime: 5000,     // cache valid for 5 sec
  });

  // -----------------------------------
  // useMutation -> POST API
  // -----------------------------------
  const mutation = useMutation({
    mutationFn: addUser,

    // auto refetch after success
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });

  // Loading
  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  // Error
  if (error instanceof Error) {
    return <h2>{error.message}</h2>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>React Query Example</h1>

      {/* ADD USER */}
      <button
        onClick={() => mutation.mutate()}
        style={{ marginRight: "10px" }}
      >
        Add User
      </button>

      {/* MANUAL REFETCH */}
      <button onClick={() => refetch()}>
        Refetch Users
      </button>

      {/* Mutation Status */}
      {mutation.isPending && <p>Adding user...</p>}

      {/* USER LIST */}
      <ul>
        {data?.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong>
            <br />
            {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

// -----------------------------------
// QUERY CLIENT
// -----------------------------------
const queryClient = new QueryClient();

// -----------------------------------
// APP
// -----------------------------------
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Users />
    </QueryClientProvider>
  );
};

// -----------------------------------
// ROOT
// -----------------------------------
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);