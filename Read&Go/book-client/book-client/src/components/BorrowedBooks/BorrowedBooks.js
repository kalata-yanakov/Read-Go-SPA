import React from 'react';
import toastr from 'toastr';
import { BASE_URL } from '../Common/constants';
import {  Button } from '@material-ui/core';

const BorrowedBooks = (props) => {
    const book = props.book;
    const setBorrowedBooks = props.setBorrowedBooks;
    const borrowedBooks = props.BorrowedBooks;

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

                const newB = borrowedBooks.filter((b) => b.id !== book.id)
                setBorrowedBooks(newB);
            })
            .catch(alert);
    };

    return (
        <>
            <h4>{book.title}</h4>

            <Button
                onClick={() => returnBook()}
            >
                Return
      </Button>
        </>
    )

}

export default BorrowedBooks;



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