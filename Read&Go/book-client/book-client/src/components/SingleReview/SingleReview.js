import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import {  Button, Icon } from '@material-ui/core';
import UserContext from '../Providers/UserContext';
import { BASE_URL } from '../Common/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

const SingleReview = (props) => {
  const reviewId = props.reviewId;
  const username = props.username;
  const content = props.content;
  const userId = props.userId;
  const bookId = props.bookId;
  const setReviews = props.setReviews;
  const reviews = props.reviews;
  const votes = props.votes;


  const [showInput, setShowInput] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState('');

  const voteForReview = (vote) => {
    fetch(`${BASE_URL}/api/books/${bookId}/reviews/${reviewId}/votes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify({ reaction: vote }),
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.error) {
          return alert(result.message);
        }
        const reviewToChange = reviews.filter((r) => r.id === reviewId);
        const reviewIndex = reviews.indexOf(reviewToChange[0]);
        reviewToChange[0].votes = [...result];
        reviews[reviewIndex] = { ...reviewToChange[0] }

        setReviews([...reviews]);

      })
      .catch(alert);
  }

  const showEditForm = () => {
    setShowInput(!showInput);
  };

  const userContext = useContext(UserContext);

  const loggedUser = userContext.user;

  const DeleteReview = () => {
    fetch(`${BASE_URL}/api/books/${bookId}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.error) {
          return alert(result.message);
        }
        const newReviews = reviews.filter((r) => r.id !== reviewId);
        setReviews(newReviews);
      })
      .catch(alert);
  };

  const editReview = (reviewToEdit) => {
    fetch(`${BASE_URL}/api/books/${bookId}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify({ content: reviewToEdit }),
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.error) {
          return alert(result.message);
        }
        const reviewToChange = reviews.filter((r) => r.id === reviewId);
        const reviewIndex = reviews.indexOf(reviewToChange[0]);
        reviews[reviewIndex].content = result.content;

        setReviews([...reviews]);
        showEditForm()
      })
      .catch(alert);
  };

  const ShowButtons = () => {
    if (userId === loggedUser.id) {
      return (
        <>
          <IconButton onClick={showEditForm}>
            <EditIcon />
          </IconButton>
          {showInput ? (
            <>
              <input
                type='text'
                placeholder={content}
                onChange={(e) => setReviewToEdit(e.target.value)}
              ></input>
              <Button
                onClick={() => editReview(reviewToEdit)}
                variant='contained'
                color='primary'
                size='small'
                className={classes.button}
                endIcon={<Icon>edit</Icon>}
              >
                Edit
              </Button>
            </>
          ) : null}

          <IconButton
            onClick={() => DeleteReview(reviewId)}
            edge='end'
            aria-label='delete'
          >
            <DeleteIcon />
          </IconButton>
        </>
      );
    }

    return null;
  };

  const classes = useStyles();
  const [dense, setDense] = useState(false);

  return (
    <div className={classes.root}>
      <List dense={dense}>
        <ListItem>
          <ListItemText primary={content} secondary={username} />
          <ListItemSecondaryAction></ListItemSecondaryAction>
        </ListItem>
        <IconButton onClick={() => voteForReview(1)}>
          <ThumbUpAltIcon />
        </IconButton>
        <h3 style={{ display: "inline" }}> {votes.filter((v) => v.reaction === 1).length}</h3>
        <IconButton onClick={() => voteForReview(2)}>
          <ThumbDownAltIcon />
        </IconButton>
        <h3 style={{ display: "inline" }}> {votes.filter((v) => v.reaction === 2).length}</h3>

        {ShowButtons()}
      </List>
    </div>
  );
};

export default withRouter(SingleReview);
