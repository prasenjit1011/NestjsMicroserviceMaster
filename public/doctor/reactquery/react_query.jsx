import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";

import ReactDOM from "react-dom/client";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

/* ================= CONFIG ================= */

const LIMIT = 3;

/* ================= API ================= */

const fetchProducts = async (page, limit, signal) => {
  const url = `http://localhost:3000/productlist?page=${page}&limit=${limit}`;

  const res = await fetch(url, { signal });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
};

/* ================= APP ================= */

const App = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["productdata", page, LIMIT],
    queryFn: ({ signal }) => fetchProducts(page, LIMIT, signal),

    placeholderData: (prev) => prev,

    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    retry: 1,
  });

  /* ================= PREFETCH NEXT PAGE ================= */

  useEffect(() => {
    if (data && data.page < data.totalPages) {
      queryClient.prefetchQuery({
        queryKey: ["productdata", page + 1, LIMIT],
        queryFn: ({ signal }) =>
          fetchProducts(page + 1, LIMIT, signal),
      });
    }
  }, [data, page, queryClient]);

  /* ================= HANDLERS ================= */

  const nextPage = useCallback(() => {
    if (data && page < data.totalPages) {
      setPage((p) => p + 1);
    }
  }, [data, page]);

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(p - 1, 1));
  }, []);

  /* ================= MEMO ================= */

  const products = useMemo(() => data?.data ?? [], [data]);

  /* ================= UI STATES ================= */

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  /* ================= UI ================= */

  return (
    <div style={{ padding: 20 }}>
      <h2>Products : {isFetching && <>PreFetching data of page {page}...</>}</h2>

      

      <ul>
        
        {products.map((p) => (
          <li key={p._id}>
            {p.name} — ₹{p.price} (Stock: {p.stock})
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={prevPage}
          disabled={page === 1}
          style={{ cursor: "pointer" }}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {data?.page ?? 1} / {data?.totalPages ?? 1}
        </span>

        <button
          onClick={nextPage}
          disabled={page === data?.totalPages}
          style={{ cursor: "pointer" }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

/* ================= QUERY CLIENT ================= */

const queryClient = new QueryClient();

/* ================= ROOT (FIXED NULL SAFE) ================= */

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element (#root) not found in index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);