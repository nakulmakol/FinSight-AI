import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "./layout/mainlayout";

import Dashboard from "./pages/dashboard";
import Chat from "./pages/chat";
import Portfolio from "./pages/portfolio";
import Analytics from "./pages/analytics";
import News from "./pages/news";

import Settings from "./pages/settings";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/chat"
          element={<Chat />}
        />

        <Route
          path="/portfolio"
          element={<Portfolio />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/news"
          element={<News />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />
      </Route>
    </Routes>
  );
}