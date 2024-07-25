import React from "react";
import "./App.css";
import CameraFeed from "./CameraFeed";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Face Detection App</h1>
      </header>
      <CameraFeed />
    </div>
  );
}

export default App;
