import React, { useState } from 'react';

import {
  USER_CONNECTED,
  VERIFY_USER,
} from '../Events';

import './LoginView.scss';

const LoginView = (props) => {
  const { socket, handleSetUser } = props;

  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');

  const handleCheckUser = ({user, isUser}) => {
    if(isUser) {
      setError('That username is taken');
    }else{
      socket.emit(USER_CONNECTED, user);
      handleSetUser(user);
    }
  }

  const handleUsernameChange = (event) => {
    setError(null);
    setUsername(event.target.value);
  } 

  const handleSubmit = (event) => {
    event.preventDefault();
    socket.emit(VERIFY_USER, username, handleCheckUser);
  }

  return (
    <div className="login__container">
      <form onSubmit={handleSubmit}>
        
        <div className="login__error">{ error ? error : '' }</div>
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          className="login__input"
        />

        <button
          className="login__btn"
          disabled={username.length < 1}
        >
          Login
        </button>
      </form>
    </div>
  )
} 

export default LoginView