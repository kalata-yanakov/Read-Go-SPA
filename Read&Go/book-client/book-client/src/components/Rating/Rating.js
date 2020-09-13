import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import { labels } from '../Common/constants';
import { BASE_URL } from '../Common/constants';

const HoverRating = (props) => {
  const avgRating = props.rating;
  const book = props.book;

  const useStyles = makeStyles({
    root: {
      width: 200,
      display: 'flex',
      alignItems: 'center',
    },
  });

  const rateBook = (value) => {
   
    fetch(`${BASE_URL}/api/books/${book.id}/rate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify({ rating: value }),
    })
      .then((r) => r.json())
      .then((books) => {
        if (books.error) {
          throw new Error(books.message);
        }
        fetch(`${BASE_URL}/api/books/${book.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        })
          .then((r) => r.json())
          .then((book) => {
            if (book.error) {
              throw new Error(book.message);
            }

            const ratings = book.rating.map(({ rating }) => rating);

            const avarageRating =
              ratings.reduce((acc, c) => acc + c, 0) / ratings.length;

            setValue(avarageRating);
          })
          .catch((error) => error.message);
      })
      .catch((error) => error.message);
  };

  const [value, setValue] = useState(avgRating);
  const [hover, setHover] = useState(-1);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Rating
        name={`hover-feedback-${book.id}`}
        value={value}
        precision={0.5}
        onChange={(event, newValue) => {
          setValue(newValue);
          rateBook(hover);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
      />
      {value !== null && (
        <Box ml={2}>{labels[hover !== -1 ? hover : value]}</Box>
      )}
    </div>
  );
};

export default HoverRating;
