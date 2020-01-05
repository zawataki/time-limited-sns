import React from 'react';
import firebase from "./firebase";
import './UserProfile.css';
import moment from 'moment-timezone';
import { NavLink } from 'react-router-dom';
import PostedMessage from './PostedMessage';

const db = firebase.firestore();

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isUserProfileLoaded: false,
      isUserPostsLoaded: false,
      user: {
        id: props.match.params.id,
        name: "",
        profilePictureMiddle: "",
      },
      posts: []
    };
  }

  componentDidMount() {
    db.collection("users").doc(this.state.user.id)
      .get()
      .then(userSnapshot => {
        if (!userSnapshot.exists) {
          throw new Error("ユーザが見つかりません");
        }

        const tmpUser = this.state.user;
        tmpUser.name = userSnapshot.data().name;
        tmpUser.profilePictureMiddle =
          userSnapshot.data().profilePictures.middle;

        this.setState({
          isUserProfileLoaded: true,
          user: tmpUser
        });

        this.fetchPostedContentsOfUser(this, userSnapshot.ref);
      })
      .catch(error => {
        console.error("Failed to get user profile.", error);
        this.setState({
          isUserProfileLoaded: true,
          error
        });
      });
  }

  fetchPostedContentsOfUser(currentComponent, userReference) {
    db.collection("posted-contents")
      .where('author', '==', userReference)
      .where('postedAt', '>=', moment().subtract(1, 'hours').toDate())
      .orderBy("postedAt", "desc")
      // TODO Get old posted contents after scrolling down to the most bottom
      .limit(20)
      .get()
      .then(function (querySnapshot) {

        Promise.all(querySnapshot.docs.map(async (doc) => {
          return {
            id: doc.id,
            content: doc.data().body,
            postedAt: moment.unix(doc.data().postedAt.seconds),
            author: {
              id: currentComponent.state.user.id,
              name: currentComponent.state.user.name,
              profilePictureURL: currentComponent.state.user.profilePictureMiddle,
            },
          };
        }))
          .then(function (posts) {
            currentComponent.setState({
              isUserPostsLoaded: true,
              posts
            });
          });
      })
      .catch(error => {
        console.error("Failed to get user's posts: ", error);
        currentComponent.setState({
          isUserPostsLoaded: true,
          error
        });
      });
  }

  render() {
    const { error, isUserProfileLoaded, isUserPostsLoaded, user } = this.state;
    if (error) {
      return <div>エラーが発生しました: {error.message}</div>
    } else if (!isUserProfileLoaded) {
      return <div>ユーザ情報を取得中です・・・</div>
    } else {

      let element;
      if (!isUserPostsLoaded) {
        element = <div>このユーザの投稿を取得中です。</div>
      } else {
        const list = [];
        for (const post of this.state.posts) {
          list.push(<PostedMessage key={post.id} post={post} />);
        }
        element = list.length <= 0 ? <div>まだ投稿がありません。</div> : list;
      }

      return (
        <div className='UserProfile'>
          <div className='UserProfile-top'>
            <div className='UserProfile-photo'>
              <img src={user.profilePictureMiddle} alt='profile'></img>
            </div>
            <div className='UserProfile-name'>{user.name}</div>
            {user.id === firebase.auth().currentUser.uid ?
              <div className="UserProfile-edit-button">
                <NavLink className="UserProfile-edit-button" to='/time-limited-sns/settings/profile/'>
                  <button>プロフィールを編集</button>
                </NavLink>
              </div> :
              ""}
          </div>
          <div className='UserProfile-posted-contents'>
            {element}
          </div>
        </div>
      );
    }
  }
}

export default UserProfile;
