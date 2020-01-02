import React from 'react';
import './App.css';
import Timeline from "./Timeline";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import UserProfile from './UserProfile';
import firebase from "./firebase";
import SignIn from './SignIn';
import PostPage from './PostPage';
import ProfileEdit from './ProfileEdit';

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
    const timeLinePage = (
      <div>
        <BrowserRouter>
          <header className="App-header">
            <div>
              <NavLink className="App-link" to='/time-limited-sns/'>
                カゲロウ（開発中）
              </NavLink>
            </div>
            <div>
              <img src={this.state.user?.photoURL} alt='profile'></img>
            </div>
            <div className="App-header-signout-button">
              <button onClick={this.signOut}>ログアウト</button>
            </div>
          </header>
          <main className="App-main">
            <Route exact path='/time-limited-sns/' component={Timeline} />
            <Route exact path='/time-limited-sns/users/:id' component={UserProfile} />
            <Route exact path='/time-limited-sns/compose/post/' component={PostPage} />
            <Route exact path='/time-limited-sns/settings/profile/' component={ProfileEdit} />
          </main>
        </BrowserRouter>
      </div>
    );

    const getPageContent = () => {
      if (!this.state.checked_signin) {
        return (
          <div>
            ログイン状態を確認中です。<br />
            少々お待ち下さい。（数秒かかることがあります）
          </div>
        )
      }

      return this.state.user ? timeLinePage : <SignIn />
    }

    return (
      <div className="App">
        {getPageContent()}
      </div >
    );
  }
}

export default App;
