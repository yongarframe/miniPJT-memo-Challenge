import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { DragDropProvider } from "./Context/DragDropContext.jsx";

createRoot(document.getElementById("root")).render(
  <DragDropProvider>
    <App />
  </DragDropProvider>
);
