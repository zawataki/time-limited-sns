import React from 'react';
import './Timeline.css';
import moment from 'moment-timezone';
import { NavLink } from "react-router-dom";
import firebase from "./firebase";

function Post(props) {
  let post = props.post;
  let timestamp = post.postedAt.tz("Asia/Tokyo")
    .format('YYYY-MM-DD HH:mm:ss');

  return (
    <article id={post.id} className="Post">
      <div className="Post-username-timestamp">
        <div>
          <NavLink className="Post-username"
            to={'/time-limited-sns/users/' + post.author.id}>
            {post.author.name}
          </NavLink>
        </div>
        <div className="Post-timestamp">　·　</div>
        <div className="Post-timestamp">{timestamp}</div>
      </div>
      <div>{post.content}</div>
    </article>
  );
}

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
    const db = firebase.firestore();
    db.collection("posted-contents")
      .orderBy("postedAt", "desc")
      // TODO Get old posted contents after scrolling down to the most bottom
      .limit(20)
      .get()
      .then(function (querySnapshot) {

        const posts = querySnapshot.docs.map(doc => {
          // doc.data() is never undefined for query doc snapshots
          return {
            id: doc.id,
            content: doc.data().body,
            postedAt: moment.unix(doc.data().postedAt.seconds),
            author: {
              id: doc.data().authorID,
              // TODO Set correct name
              name: doc.data().authorID[0] + "さん"
            },
          };
        });

        currentComponent.setState({
          isLoaded: true,
          posts
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
          {list}
        </div>
      );
    }
  }
}

export default Timeline;
