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
          <span>SNSのメッセージを</span><span>あとから消すのに</span><span>疲れたあなたへ</span>
        </div>
        <div className='SignIn-description'>
          <span>カゲロウは、投稿したメッセージが</span><span>1時間で消えるSNSです。</span><br />
          <span>さあ、カゲロウを使って、あとで消す手間から</span><span>解放されましょう！</span>
        </div>
        <div className='SignIn-button'>
          <button onClick={this.signIn}><span>Twitterアカウントで</span><span>新規登録／ログイン</span></button>
        </div>
        <div className='SignIn-description'>
          ちなみに、カゲロウという名前は昆虫のカゲロウ（蜉蝣）から来ています。
          昆虫のカゲロウの成虫は寿命が1日と短命なため、
          「メッセージが1時間で消える」というこのSNSの特徴と近いものを感じ、この名前にしました。
        </div>
      </div >
    );
  }
}

export default SignIn;
