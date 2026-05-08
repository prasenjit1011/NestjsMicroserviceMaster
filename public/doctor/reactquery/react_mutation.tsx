import React from "react";
import ReactDOM from "react-dom/client";
import {  QueryClient,  QueryClientProvider,  useMutation } from "@tanstack/react-query";


// ✅ Create client
const queryClient = new QueryClient();
const object      = {  "name": "Moon Light",  "price": 20000,  "category": "Electronics",  "inStock": true }
const url         = "http://localhost:3000/products"
const headers     = { "Content-Type": "application/json" }

const createUser = async () => {
  const res = await fetch(url, {  method: "POST", body: JSON.stringify(object), headers });
  return res.json();
};

function App() {
  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
  });

  return (
    <div>
      <p>{JSON.stringify(object)}</p>
      <button onClick={() => mutate()} disabled={isPending} style={{cursor:'pointer'}}>
        {isPending ? "Saving..." : "Save"}
      </button>      
    </div>
  );
}

// ✅ Wrap with QueryClientProvider
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <h1>React Query Mutation Example</h1>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);