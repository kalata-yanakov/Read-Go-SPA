import React from 'react';
import { BASE_URL } from '../Common/constants';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import toastr from 'toastr';

const SingleBookInfo = (props) => {

  const book = props.book;

  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));
  const classes = useStyles();

  const borrowBook = () => {
    fetch(`${BASE_URL}/api/books/${book.id}`, {
      method: 'PUT',
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
        toastr.success(`${result.title} has been borrowed.`)
      })
      .catch(alert);
  };

  const returnBook = () => {
    fetch(`${BASE_URL}/api/books/${book.id}`, {
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
        toastr.info(`${result.title} has been returned.`)


      })
      .catch(alert);
  };

  return (
    <div className={classes.root}>


      <Button
        variant='contained'
        color='primary'
        className={classes.button}
        endIcon={<AddShoppingCartIcon />}
        onClick={() => borrowBook()}
      >
        Borrow
      </Button>
      <Button
        variant='contained'
        color='secondary'
        className={classes.button}
        endIcon={<IndeterminateCheckBoxIcon />}
        onClick={() => returnBook()}
      >
        Return
      </Button>
    </div>
  );
};

export default SingleBookInfo;



toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-center",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut",
  


}