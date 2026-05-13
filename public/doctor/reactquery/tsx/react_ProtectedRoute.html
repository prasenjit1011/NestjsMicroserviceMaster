import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { useState } from "react";

const ProtectedRoute = ({
  isLogin,
  children
}) => {

  return isLogin
    ? children
    : <Navigate to="/login" />;
};

const Dashboard = () => <h1>Dashboard</h1>;

const Login = ({ setIsLogin }) => {

  return (
    <button
      onClick={() => setIsLogin(true)}
    >
      Login
    </button>
  );
};

export default function App() {

  const [isLogin, setIsLogin] =
    useState(false);

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={
            <Login
              setIsLogin={setIsLogin}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              isLogin={isLogin}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}