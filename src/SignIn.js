import React from 'react';
import firebase from "./firebase";
import './SignIn.css';

class SignIn extends React.Component {
  signIn() {
    const provider = new firebase.auth.TwitterAuthProvider()
    firebase.auth().signInWithRedirect(provider)
  }

  render() {
    return (
      <div className='SignIn'>
        <div className='SignIn-top-message'>
          ツイートをあとから消すのに疲れたあなたへ
        </div>
        <div className='SignIn-description'>
          カゲロウは、投稿したメッセージが1時間で消えるSNSです。<br />
          さあ、カゲロウをはじめて、あとで消す手間から解放されましょう！
        </div>
        <div className='SignIn-button'>
          <button onClick={this.signIn}>Twitterアカウントで新規登録／ログイン</button>
        </div>
      </div >
    );
  }
}

export default SignIn;
