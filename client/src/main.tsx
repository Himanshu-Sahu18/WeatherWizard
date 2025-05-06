import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// Add Font Awesome styles for weather icons
import { createPortal } from "react-dom";

// Add Font Awesome CDN
const head = document.head;
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
head.appendChild(link);

// Add Inter font
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
head.appendChild(fontLink);

// Add page title and meta
document.title = "WeatherNow | Live Weather App";
const meta = document.createElement("meta");
meta.name = "description";
meta.content = "Get real-time weather updates for cities around the world with WeatherNow.";
head.appendChild(meta);

createRoot(document.getElementById("root")!).render(<App />);
