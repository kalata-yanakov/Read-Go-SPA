import React, { useContext, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import { Typography, Button } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import UserContext from '../Providers/UserContext';
import { BASE_URL } from '../Common/constants';
import './Profile.css';
import BorrowedBooks from '../BorrowedBooks/BorrowedBooks';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    backgroundSize: '150px 150px',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function RecipeReviewCard() {
  const classes = useStyles();

  const [borrowedBooks, setBorrowedBooks] = useState([]);

  const { user } = useContext(UserContext);
  useEffect(() => {
    fetch(`${BASE_URL}/api/books/borrowed/pisnami`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.error) {
          throw new Error(result.message);
        }
        setBorrowedBooks(result);
      })
      .catch((error) => error.message);
  }, []);

  return (
    <>
      <div className='profile-page-asd'>
        <Card className={classes.root}>
          <CardHeader
            avatar={
              <Avatar aria-label='recipe' className={classes.avatar}>
                {user.username[0].toUpperCase()}
              </Avatar>
            }
            action={
              <IconButton aria-label='settings'>
                <MoreVertIcon />
              </IconButton>
            }
            title='Username: '
            subheader={user.username}
          />
          <CardMedia
            className={classes.media}
            image={
              'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png'
            }
            style={{ height: '50px' }}
          />
          <CardContent>
            <Button
              variant='contained'
              color='primary'
              size='small'
              className={classes.button}
              endIcon={<PhotoCameraIcon />}
            >
              Change Profile Pic
            </Button>
            <Typography variant='body2' color='textSecondary' component='p'>
              Borrowed books:
              {borrowedBooks !== undefined
                ? borrowedBooks.map((b) => (
                    <BorrowedBooks
                      key={b.id}
                      book={b}
                      BorrowedBooks={borrowedBooks}
                      setBorrowedBooks={setBorrowedBooks}
                    />
                  ))
                : null}
            </Typography>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
