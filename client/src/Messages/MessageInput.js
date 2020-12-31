import React, { useState, useRef, useEffect } from 'react';

import './Messages.scss';

const MessageInput = (props) => {
  const { handleSendMessage, handleSendTyping } = props;

  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false); 

  const typingIntervalRef = useRef();
  const lastUpdateTime = useRef();

  useEffect(() => {
    return () => {
      stopCheckingTyping();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendTyping = () => {
    lastUpdateTime.current = Date.now();
    if(!isTyping){
      setIsTyping(true);
      handleSendTyping(true);
      startIsTypingCheck();
    }
  }

  /**
   * startIsTypingCheck
   * Start an interval that checks if user is typing
  */
  const startIsTypingCheck = () => {
    typingIntervalRef.current = setInterval(() => {
      if((Date.now() - lastUpdateTime.current) > 300){
        setIsTyping(false);
        stopCheckingTyping();
      }
    }, 300)
  }

  /**
   * stopIsTypingCheck
   * Start the interval from checking if user is typing
  */
  const stopCheckingTyping = () => {
    if(typingIntervalRef.current){
      clearInterval(typingIntervalRef.current);
      handleSendTyping(false);
    }
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
          onKeyUp={e => {e.key !== 13 && sendTyping()}}
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