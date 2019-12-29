import React from 'react';
import './App.css';
import Timeline from "./Timeline";
import { BrowserRouter, Route } from "react-router-dom";
import UserHome from './UserHome';
import firebase from "./firebase";
import SignIn from './SignIn';

class App extends React.Component {
  state = {
    user: null,
    checked_signin: false
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({
        user: user,
        checked_signin: true
      })
    })
  }

  signOut() {
    firebase.auth().signOut()
  }

  render() {
    const signInPage = (
      <div className="App">
        <SignIn />
      </div>
    );

    const timeLinePage = (
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
            <img src={this.state.user && this.state.user.photoURL} alt='profile'></img>
            {this.state.user && this.state.user.displayName}
            <button onClick={this.signOut}>ログアウト</button>
            <Route exact path='/time-limited-sns/' component={Timeline} />
            <Route path='/time-limited-sns/users/:id' component={UserHome} />
          </main>
        </BrowserRouter>
      </div>
    );

    const judge = () => {
      if (!this.state.checked_signin) {
        return <div>ログイン状態を確認中です。少々お待ち下さい。</div>
      }

      return this.state.user ? timeLinePage : signInPage
    }

    return (
      <div className="App">
        {judge()}
      </div >
    );
  }
}

export default App;
