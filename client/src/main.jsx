import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from '../dev-dist/registerSW.js';

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
registerSW();
