import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply theme before render to prevent flash
const stored = localStorage.getItem("abcd-theme");
const isDark = stored ? stored === "dark" : true;
document.documentElement.classList.toggle("dark", isDark);

createRoot(document.getElementById("root")!).render(<App />);
