import React from 'react';
import firebase from "./firebase";
import './UserProfile.css';
import moment from 'moment-timezone';
import { NavLink } from 'react-router-dom';
import PostedMessage from './PostedMessage';
import PostButton from './PostButton';

const db = firebase.firestore();

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isUserProfileLoaded: false,
      isUserPostsLoaded: false,
      user: {
        id: props.id,
        name: "",
        profilePictureMiddle: "",
      },
      posts: []
    };

    // This binding is necessary to make `this` work in the callback
    this.confirmDeletionAccount = this.confirmDeletionAccount.bind(this);
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

  async confirmDeletionAccount() {
    // TODO Force user to input some word (like "delete") to avoid unintentionally deletion
    const agreedWithDeletion = window.confirm("アカウントを削除しますか？");

    if (agreedWithDeletion) {
      try {
        await this.deleteUserAccount();
      } catch (error) {
        if (error.code === "auth/requires-recent-login") {
          window.alert(`アカウントを削除するためにTwitterの再認証が必要です。
この画面に再び戻ってきた後に改めてアカウントの削除をお試しください。`);

          const user = firebase.auth().currentUser;
          const authProvider = new firebase.auth.TwitterAuthProvider();
          await user.reauthenticateWithRedirect(authProvider);
          return
        }
        console.error("Failed to delete account", error);
        window.alert("アカウントの削除に失敗しました");
      }
    }
  }

  async deleteUserAccount() {
    console.log("Delete user account");
    await firebase.auth().currentUser.delete();
    window.alert(`今までご利用いただき、ありがとうございました。
アカウント削除が完了しました。
なお、Twitterのアプリ連携については、Twitter側の制限のため
お客様自身で解除する必要があります。
解除するには、このメッセージを消した後に表示されるTwitter画面から
「アクセス権を取り消す」を実行してください。`);
    window.location.href = "https://twitter.com/settings/applications/17209810";
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

      const authUserComponents = (
        <div className="UserProfile-menu">
          <div className="UserProfile-edit-button">
            <NavLink className="UserProfile-edit-button" to='/settings/profile/'>
              <button>プロフィールを編集</button>
            </NavLink>
          </div>
          <div className="UserProfile-delete-button">
            <button onClick={this.confirmDeletionAccount}>アカウントを削除</button>
          </div>
        </div>
      );

      return (
        <div className='UserProfile'>
          <div className='UserProfile-top'>
            <div className='UserProfile-photo'>
              <img src={user.profilePictureMiddle} alt='profile'></img>
            </div>
            <div className='UserProfile-name'>{user.name}</div>
            {user.id === firebase.auth().currentUser.uid ?
              authUserComponents :
              ""}
          </div>
          <div className='UserProfile-posted-contents'>
            <PostButton />
            {element}
          </div>
        </div>
      );
    }
  }
}

export default UserProfile;
