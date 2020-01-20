import React from 'react';
import './App.css';
import Timeline from "./Timeline";
import { BrowserRouter, Route, NavLink, Switch } from "react-router-dom";
import UserProfile from './UserProfile';
import firebase from "./firebase";
import SignIn from './SignIn';
import PostPage from './PostPage';
import ProfileEdit from './ProfileEdit';
import PageNotFound from './PageNotFound';

class App extends React.Component {
  state = {
    loggedInUser: null,
    checked_signin: false
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({
        loggedInUser: user,
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
              <NavLink className="App-link" to='/'>
                カゲロウ
              </NavLink>
            </div>
            <div>
              <NavLink to={'/users/' + this.state.loggedInUser?.uid}>
                <img src={this.state.loggedInUser?.photoURL} alt='profile'></img>
              </NavLink>
            </div>
            <div className="App-header-signout-button">
              <button onClick={this.signOut}>ログアウト</button>
            </div>
          </header>
          <main className="App-main">
            <Switch>
              <Route exact path='/' component={Timeline} />
              <Route exact path='/users/:id' render={props =>
                <UserProfile key={props.match.params.id}
                  id={props.match.params.id} />
              } />
              <Route exact path='/compose/post/' component={PostPage} />
              <Route exact path='/settings/profile/' component={ProfileEdit} />
              <Route component={PageNotFound} />
            </Switch>
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

      return this.state.loggedInUser ? timeLinePage : <SignIn />
    }

    return (
      <div className="App">
        {getPageContent()}
      </div >
    );
  }
}

export default App;
