import React, { useState } from 'react';
import useChat from '../hooks/useChat';

import './LoginView.scss';

const LoginView = (props) => {
  const { handleSetUser } = props;
  const { verifyUsername, connectUser } = useChat();

  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');

  const handleCheckUser = ({user, isUser}) => {
    if(isUser) {
      setError('That username is taken');
    }else{
      connectUser(user);
      handleSetUser(user);
    }
  }

  const handleUsernameChange = (event) => {
    setError(null);
    setUsername(event.target.value);
  } 

  const handleSubmit = (event) => {
    event.preventDefault();

    verifyUsername(username, handleCheckUser)
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