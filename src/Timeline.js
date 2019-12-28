import React from 'react';
import './Timeline.css';
import moment from 'moment-timezone';
import { NavLink } from "react-router-dom";

function Post(props) {
  let post = props.post;
  let timestamp = moment().subtract(post.id, 'seconds')
    .tz("Asia/Tokyo")
    .format('YYYY-MM-DD HH:mm:ss');
  return (
    <article id={post.id} className="Post">
      <div className="Post-username-timestamp">
        <div>
          <NavLink className="Post-username" to={'./users/' + post.userId}>
            User: {"user" + post.userId}
          </NavLink>
        </div>
        <div className="Post-timestamp">　·　</div>
        <div className="Post-timestamp">{timestamp}</div>
      </div>
      <div>{post.body}</div>
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
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            posts: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
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

      return list;
    }
  }
}

export default Timeline;
