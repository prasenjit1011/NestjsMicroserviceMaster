import React, {
  useState,
  useMemo,
  useCallback,
  Suspense,
  lazy
} from "react";

import ReactDOM from "react-dom/client";

import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from "@tanstack/react-query";

import { FixedSizeList as List } from "react-window";

// ============================
// Types
// ============================
type Photo = {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

// ============================
// Query Client
// ============================
const queryClient = new QueryClient();

// ============================
// Styles
// ============================
const style: Record<string, React.CSSProperties> = {
  parent: { border: "1px solid #F00", padding: 10 },
  child: { border: "1px solid #00F", marginTop: 10 },
  title: { textAlign: "center" },
  input: { padding: 5, width: "200px" }
};

// ============================
// Fetch Hook (FIXED)
// ============================
const usePhotos = () => {
  return useQuery<Photo[], Error>({
    queryKey: ["photos"],
    queryFn: async ({ signal }) => {
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/photos",
        { signal }
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data: Photo[] = await res.json();
      return data.slice(0, 5000);
    },
    staleTime: 1000 * 60 * 5
  });
};

// ============================
// Row Component (FIXED - NO ListChildComponentProps)
// ============================
type RowProps = {
  index: number;
  style: React.CSSProperties;
  data: Photo[];
};

const Row = React.memo(({ index, style, data }: RowProps) => {
  const item = data[index];

  return (
    <div
      style={{
        ...style,
        borderBottom: "1px solid #ccc",
        padding: "5px"
      }}
    >
      {item?.title}
    </div>
  );
});

// ============================
// Virtual List (FIXED - NO lazy hack)
// ============================
type VirtualListProps = {
  items: Photo[];
};

const VirtualList = ({ items }: VirtualListProps) => {
  return (
    <List
      height={500}
      itemCount={items.length}
      itemSize={50}
      width={"100%"}
      itemData={items}
    >
      {Row}
    </List>
  );
};

// ============================
// Main Component
// ============================
function AppContent() {
  const { data = [], isLoading, error } = usePhotos();

  const [search, setSearch] = useState("");
  const [count, setCount] = useState(0);

  // Optimized filtering
  const filteredData = useMemo(() => {
    if (!search) return data;

    const lower = search.toLowerCase();

    return data.filter((item) =>
      item.title.toLowerCase().includes(lower)
    );
  }, [search, data]);

  // Stable callbacks
  const handleClear = useCallback(() => {
    setSearch("");
  }, []);

  const handleIncrement = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <div style={style.parent}>
      <h2 style={style.title}>Optimized React TS App</h2>

      <p>Count: {count}</p>

      <button onClick={handleIncrement}>
        Increment
      </button>

      <br />
      <br />

      <input
        style={style.input}
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={handleClear}>Clear</button>

      <div style={style.child}>
        <p style={style.title}>Virtualized List</p>

        <Suspense fallback={<p>Loading List...</p>}>
          <VirtualList items={filteredData} />
        </Suspense>
      </div>
    </div>
  );
}

// ============================
// App Wrapper
// ============================
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
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