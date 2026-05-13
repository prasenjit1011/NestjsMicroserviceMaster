import React from "react";
import ReactDOM from "react-dom/client";
import useSWR from "swr";

const url       = "https://jsonplaceholder.typicode.com/users/9";
type User       = {  id: number;  name: string;  email: string;  phone: string; };

const getdata   = async (): Promise<User> => {
    const response  = await fetch(url);
    if (!response.ok) { throw new Error("Failed to fetch user");    }
    return response.json();
};

const App: React.FC = () => {
    const { data,   error,    isLoading  } = useSWR<User>("cacheKey", getdata);

    if (isLoading){ return <h2>Loading...</h2>; }
    if (error){ return <h2>Error loading user</h2>; }

    return (
        <div>
            <h1>User Details</h1>
            <div>
                <p><strong>ID:</strong> {data?.id}</p>
                <p><strong>Name:</strong> {data?.name}</p>
                <p><strong>Email:</strong> {data?.email}</p>
                <p><strong>Phone:</strong> {data?.phone}</p>
            </div>
        </div>
    );
};


const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);