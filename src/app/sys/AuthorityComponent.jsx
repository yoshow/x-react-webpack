import React from 'react';

import CommentForm from './CommentForm';
import CommentList from './CommentList';

class CommentBox extends React.Component {
  render() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentForm />
        <CommentList />
      </div>
    );
  }
}

export default CommentBox;