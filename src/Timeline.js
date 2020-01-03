import React from 'react';
import './Timeline.css';
import moment from 'moment-timezone';
import { NavLink } from "react-router-dom";
import firebase from "./firebase";

const db = firebase.firestore();

function Post(props) {
  let post = props.post;
  let timestamp = post.postedAt.tz("Asia/Tokyo")
    .format('YYYY-MM-DD HH:mm:ss');

  return (
    <article id={post.id} className="Post">
      <div className="Post-username-timestamp">
        <NavLink className="Post-username"
          to={'/time-limited-sns/users/' + post.author.id}>
          <div>
            <img src={post.author.profilePictureURL} alt="profile"></img>
          </div>
          {post.author.name}
        </NavLink>
        <span className="Post-timestamp">　·　{timestamp}</span>
      </div>
      <div>{post.content}</div>
    </article>
  );
}

const cachedUsers = new Map();

class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      posts: []
    };
  }

  componentDidMount() {
    let currentComponent = this;

    db.collection("posted-contents")
      .where('postedAt', '>=', moment().subtract(1, 'hours').toDate())
      .orderBy("postedAt", "desc")
      // TODO Get old posted contents after scrolling down to the most bottom
      .limit(20)
      .get()
      .then(function (querySnapshot) {

        Promise.all(querySnapshot.docs.map(async (doc) => {
          const authorID = doc.data().author.id;
          const cachedUser = cachedUsers.get(authorID);
          let author;
          if (cachedUser !== undefined) {
            author = {
              id: authorID,
              name: cachedUser.name,
              profilePictureURL: cachedUser.profilePictureURL,
            };
          } else {
            const authorInRepository = await doc.data().author.get();
            author = {
              id: authorInRepository.id,
              name: authorInRepository.data().name,
              profilePictureURL: authorInRepository.data().profilePictures.small,
            };
          }

          cachedUsers.set(author.id, {
            name: author.name,
            profilePictureURL: author.profilePictureURL
          });

          return {
            id: doc.id,
            content: doc.data().body,
            postedAt: moment.unix(doc.data().postedAt.seconds),
            author: author,
          };
        }))
          .then(function (posts) {
            currentComponent.setState({
              isLoaded: true,
              posts
            });
          });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
        currentComponent.setState({
          isLoaded: true,
          error
        });
      });
  }

  render() {
    const { error, isLoaded, posts } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Fetching...</div>
    } else {

      let list = [];
      for (const post of posts) {
        list.push(<Post key={post.id} post={post} />);
      }

      return (
        <div>
          <div className='Timeline-post-button'>
            <NavLink className="Timeline-post-button" to='/time-limited-sns/compose/post/'>
              <button>投稿</button>
            </NavLink>
          </div>
          {list.length <= 0 ? <div>まだ投稿がありません。</div> : list}
        </div>
      );
    }
  }
}

export default Timeline;
