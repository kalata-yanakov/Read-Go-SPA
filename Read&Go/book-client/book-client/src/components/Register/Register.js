import React, { useState } from 'react';
import '../SignUp/SignUp.css';
import {BASE_URL} from '../Common/constants';
import toastr from 'toastr';

const Register = (props) => {
  const history = props.history;


  const [user, setUserObject] = useState({
    username: {
      name: 'username',
      value: '',
      placeholder: 'username',
      touched: false,
      valid: true,
    },
    password: {
      name: 'password',
      value: '',
      type: 'password',
      placeholder: 'password',
      touched: false,
      valid: true,
    },
    ConfirmPassword: {
      name: 'Confirm password',
      placeholder: 'Confirm password',
      value: '',
      type: 'password',
      touched: false,
      valid: true,
    },
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    const updatedControl = { ...user[name], value };
    const updatedUser = { ...user, [name]: updatedControl };
    setUserObject(updatedUser);
  };

  const register = (ev) => {
    ev.preventDefault();


    const userToSend = {
      username: user.username.value,
      password: user.password.value
    };

    if (!user.username.value) {
     return toastr["error"]('Invalid username!');
    }
    if (!user.password.value) {
      return toastr["error"]('Invalid password!');
    }
    if (user.password.value !== user.ConfirmPassword.value) {
      // return toastr.success('passes should match');
      return toastr["error"]("passes should match")
    }

    fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userToSend),
    })
      .then(r => r.json())
      .then(result => {
    
        if (result.error) {
          return alert(result.message);
        }
        history.push('/');
      })
      .catch(alert);
  };



  const formElements = Object.keys(user)
    .map((name) => ({ name, config: user[name] }))
    .map(({ name, config }) => {
      return (
        <input
          type={config.type}
          key={name}
          name={name}
          placeholder={config.placeholder}
          value={config.value}
          onChange={handleInputChange}
        />
      );
    });

  return (
    <>
      <div className={'ASDF'}>
        <div className={'box1234'}>
          <form onSubmit={register}>
            <span className={'text-center1234'}>Register</span>
            <div className={'input-container1234'}>{formElements}</div>
            <button className={'btn1234'} type='submit'>
              Submit!
          </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;


toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
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