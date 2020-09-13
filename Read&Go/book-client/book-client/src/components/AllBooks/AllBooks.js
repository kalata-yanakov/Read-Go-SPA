import React, { useState, useContext, useEffect } from 'react';
import UserContext from '../Providers/UserContext';
import { BASE_URL } from '../Common/constants';
import SingleBook from '../SingleBook/SingleBook';
import './AllBooks.css';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    background: '#1f2833',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: 'auto',
    overflow: 'hidden',
  },
  paper: {
    height: 340,
    width: 30,
    margin: 3,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

const AllBooks = (props) => {
  const [books, setBooks] = useState([]);
  const userContext = useContext(UserContext);

  const loggedUser = userContext.user;

  useEffect(() => {
    fetch(`${BASE_URL}/api/books/${props.location.search || ''}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    })
      .then((r) => r.json())
      .then((books) => {
        if (books.error) {
          throw new Error(books.message);
        }
        setBooks(books);
      })
      .catch((error) => error.message);
  }, [props.location.search, props.location.pathname]);

  const [spacing, setSpacing] = useState(2);
  const classes = useStyles();

 
  return (
    <div className={classes.root}>
      <Grid container className={classes.root} spacing={0}>
        {books.map((b, i) => (
          <Grid key={b.id} item xs={3}>
            <Grid container justify='center' spacing={spacing}>
              <SingleBook
                key={b.id}
                book={b}
                loggedUser={loggedUser}
               
              />
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AllBooks;
