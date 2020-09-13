import React from 'react';
import SingleReview from '../SingleReview/SingleReview';

const ReviewsFront = (props) => {
  const reviews = props.Reviews;
  const bookId = props.bookId;
  const setReviews = props.setReviews;
  

  return (
    <>
      {reviews.map((r) => (
        <SingleReview
          key={r.id}
          reviews={reviews}
          setReviews={setReviews}
          bookId={bookId}
          reviewId={r.id}
          content={r.content}
          username={r.user.username}
          userId={r.user.id}
          votes={r.votes}
         
        />
      ))}
    </>
  );
};

export default ReviewsFront;
