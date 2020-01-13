import React, { useState } from 'react';
import './PostedMessage.css';
import { NavLink } from "react-router-dom";
import firebase from "./firebase";
import iconDeleteMessage from './icon/delete-message.svg';

const db = firebase.firestore();
const auth = firebase.auth();

function PostedMessage(props) {
  let post = props.post;
  let timestamp = post.postedAt.tz("Asia/Tokyo")
    .format('YYYY-MM-DD HH:mm:ss');

  const [deleted, setDeleted] = useState(false);

  const confirmDeletionMessage = async () => {
    const agreedWithDeletion = window.confirm("メッセージを削除しますか？");
    if (agreedWithDeletion) {
      await db.collection("posted-contents").doc(post.id).delete();
      setDeleted(true);
    }
  };

  return (
    <article id={post.id} className="Post" style={{
      display: `${deleted ? 'none' : ''}`
    }}>
      <div className="Post-user-icon">
        <NavLink className="Post-user-icon-link"
          to={'/users/' + post.author.id}>
          <img src={post.author.profilePictureURL} alt="profile"></img>
        </NavLink>
      </div>
      <div className="Post-username-timestamp-content">
        <div className="Post-top-line">
          <div className="Post-top-line-left-side">
            <NavLink className="Post-username"
              to={'/users/' + post.author.id}>
              {post.author.name}
            </NavLink>
            <span className="Post-timestamp">　·　{timestamp}</span>
          </div>
          <div className="Post-top-line-right-side">
            {
              post.author.id === auth.currentUser.uid ?
                <img className="Post-delete-icon" src={iconDeleteMessage}
                  alt="delete" onClick={confirmDeletionMessage}></img> :
                ''
            }
          </div>
        </div>
        <div className="Post-content">{post.content}</div>
      </div>
    </article>
  );
}

export default PostedMessage;
