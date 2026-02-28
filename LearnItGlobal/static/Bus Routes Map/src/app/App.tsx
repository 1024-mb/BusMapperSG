import { createRoot } from "react-dom/client";
import { SubwayMap } from "./components/SubwayMap";
import { BusMap } from "../LearnItG/components/BusMap";

const container = document.getElementById("map-container");

if (container) {
  const root = createRoot(container);

  // Attach functions globally so HTML can trigger them
  (window as any).showSubwayMap = () => root.render(<SubwayMap />);
  (window as any).showBusMap = () => root.render(<BusMap />);
}