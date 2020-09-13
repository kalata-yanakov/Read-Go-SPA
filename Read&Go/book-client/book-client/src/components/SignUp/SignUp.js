import React, { useState, useContext } from 'react';
import './SignUp.css';
import UserContext from '../Providers/UserContext';
import jwtDecode from 'jwt-decode';
import { BASE_URL } from '../Common/constants';
import toastr from 'toastr';

const SignUp = (props) => {
  const history = props.history;

  const { setUser } = useContext(UserContext);
 
  const [authForm, setAuthForm] = useState({
    username: {
      name: 'username',
      placeholder: 'username',
      value: '',
      type: 'text',
    },
    password: {
      name: 'password',
      placeholder: 'password',
      value: '',
      type: 'password',
    },
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    const updatedControl = { ...authForm[name], value };
    const updatedForm = { ...authForm, [name]: updatedControl };
    setAuthForm(updatedForm);
  };

  const login = (ev) => {
    ev.preventDefault();

    const user = {
      username: authForm.username.value,
      password: authForm.password.value,
    };

    if (!authForm.username.value) {
      return toastr["error"]('Invalid username!');
    }
    if (!authForm.password.value) {
      return toastr["error"]('Invalid password!');
    }

    fetch(`${BASE_URL}/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.error) {
          return toastr.error(result.message);
        }

        try {
          const payload = jwtDecode(result.token);
         
          setUser(payload);
        } catch (e) {
          return toastr.error(e.message);
        }

        localStorage.setItem('token', result.token);
        // showSidebar = true
        history.push('/home');
      })
      .catch(alert); // (...rest) => alert(...rest);
  };

  const formElements = Object.keys(authForm)
    .map((name) => ({ name, config: authForm[name] }))
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
          <form onSubmit={login}>
            <span className={'text-center1234'}>Login</span>
            <div className={'input-container1234'}>
              {formElements}
              <button className={'btn1234'} type='submit'>
                Login
              </button>
            </div>
            <button
              className={'btn1234'}
              onClick={() => history.push('/register')}
            >
              register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;


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