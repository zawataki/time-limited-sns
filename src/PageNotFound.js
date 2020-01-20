import React from 'react';

class PageNotFound extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      secondsToRedirect: 5,
    };
  }

  componentDidMount() {
    setInterval(() => {
      console.log('setInterval() was called')

      const newSeconds = this.state.secondsToRedirect - 1
      if (newSeconds <= 0) {
        window.location.href = '/';
      } else {
        this.setState({
          secondsToRedirect: newSeconds
        });
      }
    }, 1000);
  }

  render() {
    return (
      <div className='PageNotFound' >
        ページが見つかりません。。。<br />
        {this.state.secondsToRedirect} 秒後にトップページへ遷移します。
        </div >
    );
  }
}

export default PageNotFound;
