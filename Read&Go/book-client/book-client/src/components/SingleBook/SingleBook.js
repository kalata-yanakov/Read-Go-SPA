import React, { useState } from 'react';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withRouter } from 'react-router-dom';
import SingleBookInfo from '../SingleBookInfo/SingleBookInfo';
import { makeStyles } from '@material-ui/core';
import HoverRating from '../Rating/Rating';
import ReviewsFront from '../ReviewsFront/ReviewsFront';
import CreateReview from '../CreateReview/CreateReview';

const SingleBook = (props) => {
  const book = props.book;
  const images = props.images

  const useStyles = makeStyles((theme) => ({
    root: {
      textAlign: 'center',
      maxWidth: 345,
      margin: '20px',
      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.4)',
      fontFamily: 'arial',
      padding: 'auto',
      border: '1px solid black',
      borderRadius: '0.5em',
      background: '#FFFAF0',
    },
    media: {
      height: 0,
      paddingTop: '88.25%',
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
  }));

  const [reviews, setReviews] = useState(book.reviews);

  const ratings = book.rating.map(({ rating }) => rating);
  const avarageRating = ratings.reduce((acc, c) => acc + c, 0) / ratings.length;

  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => setExpanded(!expanded);

  
 
  return (
    <Card className={classes.root}>
      <CardHeader title={book.title} />
    
        <CardMedia className={classes.media} />
      
      <CardContent>
        <Typography variant='body2' color='textSecondary' component='p'>
          {book.content}
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        <HoverRating rating={avarageRating} book={book} />

        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label='show more'
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CreateReview Reviews={reviews} setReviews={setReviews} book={book} />
        <CardContent>
          <ReviewsFront
            Reviews={reviews}
            setReviews={setReviews}
            bookId={book.id}
          />
        </CardContent>
      </Collapse>
      <SingleBookInfo book={book} />
    </Card>
  );
};

export default withRouter(SingleBook);
