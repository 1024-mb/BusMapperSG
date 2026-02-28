import React from 'react';
import ReactDOM from 'react-dom/client';
import { SubwayMap } from './app/components/SubwayMap';
import { BusMap } from './app/components/BusMap';


/**
 * Show a subway map in a specific container
 * @param mapType - The type of map to display ('purple', 'red', 'green', 'blue')
 * @param busNumber
 */
export function showMap(mapType: string, busNumber?:string) {
  let container;

  if(mapType == "bus" && busNumber != null) {
    container = document.getElementById('bus-map-container');
    if (!container) {
      console.error(`Container not found`);
      return;
    }

    let root: ReactDOM.Root;

    if (!container._reactRoot) {
      container._reactRoot = ReactDOM.createRoot(container);
    }
    root = container._reactRoot;
    root.render(
      React.createElement(React.StrictMode, null,
        React.createElement(BusMap, { busNumber })
      )
    );

  }
  else if(mapType == "subway") {
    container = document.getElementById('subway-map-container');

    if (!container) {
      console.error(`Container not found`);
      return;
    }

    let root: ReactDOM.Root;

    if (!container._reactRoot) {
      container._reactRoot = ReactDOM.createRoot(container);
    }
    root = container._reactRoot;
    root.render(
      React.createElement(React.StrictMode, null,
        React.createElement(SubwayMap)
      )
    );
  }

  // Create new root and render


  // Show the container
}
