import React from 'react';
import './PostPage.css';
import firebase from "./firebase";

const db = firebase.firestore();

class ProfileEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: firebase.auth().currentUser.uid,
      userName: '',
      isUserProfileLoaded: false,
      saveButtonDisabled: true,
      nameInputAreaDisabled: false,
    };

    // This binding is necessary to make `this` work in the callback
    this.handleChange = this.handleChange.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
  }

  componentDidMount() {
    db.collection("users").doc(this.state.userID)
      .get()
      .then(userSnapshot => {
        if (!userSnapshot.exists) {
          throw new Error("ユーザが見つかりません");
        }

        this.setState({
          isUserProfileLoaded: true,
          userName: userSnapshot.data().name,
        });
      })
      .catch(error => {
        console.error("Failed to get user profile.", error);
        this.setState({
          isUserProfileLoaded: true,
          error
        });
      });
  }

  handleChange(event) {
    this.setState({
      userName: event.target.value,
      saveButtonDisabled: event.target.value ? false : true
    });
  }

  saveProfile(event) {
    this.setState({
      saveButtonDisabled: true,
      nameInputAreaDisabled: true,
    });

    db.collection("users").doc(this.state.userID).update({
      name: this.state.userName
    })
      .then(() => {
        window.history.back();
      })
      .catch(error => {
        console.error("Failed to update user profile.", error);
        alert("保存時にエラーが発生しました。\n" + error);
      });
  }

  render() {
    if (this.state.error) {
      return <div>エラーが発生しました: {this.state.error.message}</div>
    } else if (!this.state.isUserProfileLoaded) {
      return <div>ユーザ情報を取得中です・・・</div>
    } else {
      return (
        <div className='PostPage'>
          <div>
            <h2>
              プロフィールを編集
            </h2>
            <div>
              <label>
                名前:
              </label>
              <input type="text" required minLength='1' maxLength='50'
                value={this.state.userName}
                placeholder='名前を追加' onChange={this.handleChange}
                disabled={this.state.nameInputAreaDisabled}>
              </input>
            </div>
          </div>
          <div className='PostPage-post-button'>
            <button onClick={this.saveProfile}
              disabled={this.state.saveButtonDisabled}>保存</button>
          </div>
        </div>
      );
    }
  }
}

export default ProfileEdit;
