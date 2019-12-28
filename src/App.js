import React from 'react';
import './App.css';
import Timeline from "./Timeline";
import { BrowserRouter, Route } from "react-router-dom";
import UserHome from './UserHome';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <a className="App-link" href="/time-limited-sns/">
            カゲロウ
          </a>
        </div>
        <div className="App-header-description">
          （開発中）1時間で投稿が自動削除されるSNS
        </div>
      </header>
      <BrowserRouter>
        <main className="App-main">
          <Route exact path='/time-limited-sns/' component={Timeline} />
          <Route path='/time-limited-sns/users/:id' component={UserHome} />
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
