import React from 'react';
import './PostPage.css';
import firebase from "./firebase";

class PostPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      body: '',
      postButtonDisabled: true,
      textareaDisabled: false,
    };

    // This binding is necessary to make `this` work in the callback
    this.handleChange = this.handleChange.bind(this);
    this.postMessage = this.postMessage.bind(this);
  }

  handleChange(event) {
    this.setState({
      body: event.target.value,
      postButtonDisabled: event.target.value ? false : true
    });
  }

  postMessage(event) {
    this.setState({
      postButtonDisabled: true,
      textareaDisabled: true,
    });

    const db = firebase.firestore();
    db.collection("posted-contents").add({
      body: this.state.body,
      postedAt: firebase.firestore.FieldValue.serverTimestamp(),
      authorID: firebase.auth().currentUser.uid,
    })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        alert("投稿しました");
        window.history.back();
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
        alert("投稿時にエラーが発生しました。\n" + error);
      });
  }

  render() {
    return (
      <div className='PostPage'>
        <div>
          <textarea rows="10" cols="50" autoFocus minLength='1' maxLength='200'
            placeholder='いま何してる？' required onChange={this.handleChange}
            disabled={this.state.textareaDisabled}>
          </textarea>
        </div>
        <div className='PostPage-post-button'>
          <button onClick={this.postMessage}
            disabled={this.state.postButtonDisabled}>投稿する</button>
        </div>
      </div>
    );
  }
}

export default PostPage;
