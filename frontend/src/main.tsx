import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import AppQueryProvider from "./providers/QueryProvider";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppQueryProvider>
        <App />
      </AppQueryProvider>
    </BrowserRouter>
  </React.StrictMode>
);