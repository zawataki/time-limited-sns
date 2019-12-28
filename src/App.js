import React from 'react';
import './App.css';
import Timeline from "./Timeline";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>時限SNS</div>
        <div>
          <a className="App-link" href="https://reactjs.org"
            target="_blank" rel="noopener noreferrer">
            Learn React
            </a>
        </div>
      </header>
      <main className="App-main">
        <Timeline />
      </main>
    </div>
  );
}

export default App;
