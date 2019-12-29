import React from 'react';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      user: {
        id: props.match.params.id
      }
    };
  }

  componentDidMount() {
    fetch("https://jsonplaceholder.typicode.com/users/" + this.state.user.id)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            user: result
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
    const { error, isLoaded, user } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Fetching user...</div>
    } else {
      return (
        <div>
          <div>ID: {user.id}</div>
          <div>Username: {user.name}</div>
        </div>
      );
    }
  }
}

export default UserProfile;
