import React, { useContext, useState} from 'react';
import PostAddIcon from '@material-ui/icons/PostAdd';
import IconButton from '@material-ui/core/IconButton';
import UserContext from '../Providers/UserContext';
import { BASE_URL } from '../Common/constants';
import Button from '@material-ui/core/Button';
import { Icon } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const CreateReview = (props) => {
  const reviews = props.Reviews;
  const setReviews = props.setReviews;
  const classes = useStyles();
  const book = props.book;

  const userContext = useContext(UserContext);
  const loggedUser = userContext.user;

  const createReview = (review) => {
    fetch(`${BASE_URL}/api/books/${book.id}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify({ content: review }),
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.error) {
          return alert(result.message);
        }
        setShowInput(!showInput);

        
         setReviews([...reviews, {id: result.id, content: result.content, user:{id: loggedUser.id, username: loggedUser.username}, votes: []}])
       
      })
      .catch(alert);
  };

  // const [seeReview, setSeeReview] = useState(props.book.reviews);
  const [reviewToSend, setReviewToSend] = useState('');
  const [showInput, setShowInput] = useState(false);

  const ShowCreateForm = () => {
    setShowInput(!showInput);
  };

  return (
    <>
      <IconButton onClick={ShowCreateForm}>
        <PostAddIcon />
      </IconButton>

      {showInput ? (
        <>
          <input
            type='text'
            placeholder='add comment'
            onChange={(e) => setReviewToSend(e.target.value)}
          ></input>
          <Button
            onClick={() => createReview(reviewToSend)}
            variant='contained'
            color='primary'
            size='small'
            className={classes.button}
            endIcon={<Icon>send</Icon>}
          >
            Send
          </Button>
        </>
      ) : null}
    </>
  );
};

export default CreateReview;
