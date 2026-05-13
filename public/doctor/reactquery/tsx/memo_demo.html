import ReactDOM from "react-dom/client";
import React, { useState, useMemo, useCallback } from "react";

const initialTasks: Task[] = [
    { id: 1, title: "Buy groceries", completed: false },
    { id: 2, title: "Walk the dog", completed: false },
    { id: 3, title: "Clean the house", completed: true },
    { id: 4, title: "Finish project", completed: false },
    { id: 5, title: "Read a book", completed: true },
    { id: 6, title: "Exercise", completed: false }
];
type Task = {id: number; title: string; completed: boolean;};

const TaskItem = React.memo(({task, onToggle}: {task: Task; onToggle: (id: number) => void; }) => {
    return (
      <li
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 8,
          marginBottom: 5,
          background: task.completed ? "#d1ffd6" : "#f2f2f2",
        }}
      >
        <span>{task.title}</span>

        <button onClick={() => onToggle(task.id)}>
          {task.completed ? "Undo" : "Done"}
        </button>
      </li>
    );
  }
);

/* ---------------- Parent ---------------- */
export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const [search, setSearch] = useState("");

  console.log("🔁 Parent Render");

  /* ---------------- useCallback ---------------- */
  const toggleTask = useCallback((id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }, []);

  /* ---------------- useMemo (filtered array) ---------------- */
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

  /* ---------------- UI ---------------- */
  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Task Manager (Optimization Demo)</h1>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks..."
        style={{ padding: 8, marginBottom: 10, width: "100%" }}
      />

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
          />
        ))}
      </ul>
    </div>
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