import React from 'react';
import './Home.css';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
 
  search: {
    position: 'absolute',
    margin: '20em',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: 'white',
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(40),
      width: '50vw',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
   
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',

    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const Home = (props) => {

  const classes = useStyles();

  return (
    
    <div className={classes.root}>
    <div className={classes.search} style={{marginLeft: "335px"}}>
      <div className={classes.searchIcon}>
        <SearchIcon style={{ color: '#black ' }} />
      </div>
      
      <InputBase
        
        placeholder='Search…'
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            const name = e.target.value;
            props.history.push(`/books?title=${name}`);
          }
        }}
      />
      
    </div>
   
    </div>
  );
};

export default withRouter(Home);
