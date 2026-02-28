import { showMap } from "./mapController";

declare global {
  interface Window {
    showMap: typeof showMap;
  }
}

;(window as any).showMap = showMap;