import React from 'react';
import './PostButton.css';
import { NavLink } from 'react-router-dom';

function PostButton(props) {
  return (
    <div className='PostButton'>
      <NavLink className="PostButton" to='/compose/post/'>
        <button>投稿</button>
      </NavLink>
    </div>
  );
}

export default PostButton;
