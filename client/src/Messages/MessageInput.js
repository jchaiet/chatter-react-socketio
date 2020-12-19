import React, { useState } from 'react';

import './Messages.scss';

const MessageInput = (props) => {
  const { handleSendMessage } = props;

  const [message, setMessage] = useState('');
  //const [isTyping, setIsTyping] = useState(false); 

  const handleSendTyping = () => {
    console.log('typing')
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    handleSendMessage(message);
    setMessage('');
  }

  return (
    <div className="chat__input">
      <form
        onSubmit={handleSubmit}
        className="chat__form form"
      >
        <input
          className="form__control"
          type="text"  
          value={message}
          autoComplete='off'
          placeholder="Type something..."
          onKeyUp={e => {e.key !== 13 && handleSendTyping()}}
          onChange={({target}) => setMessage(target.value)}
        />
        <button
          disabled={message.length < 1}
          type="submit"
          className="form__btn"
        >
          Send
        </button>
      </form>

    </div>
  )

}

export default MessageInput;