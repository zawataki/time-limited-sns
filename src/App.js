import React from 'react';
import './App.css';
import Timeline from "./Timeline";
import { BrowserRouter, NavLink, Route } from "react-router-dom";
import UserHome from './UserHome';

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
      <BrowserRouter>
        <main className="App-main">
          <Route exact path='/' component={Timeline} />
          <Route path='/users/:id' component={UserHome} />
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
