import React, { useRef, useEffect } from 'react';

const Messages = (props) => {
  const { messages, user, typingUsers } = props;
  const messagesEndRef = useRef(null);

  const scrollToBottom = () =>{
    messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages.length]);

  console.log(typingUsers)
  return (
    <div className="thread__container">
      <div className="thread__content">
        {messages &&
          messages.map((mes, i) => {
            return(
              <div
                key={mes.id}
                className={`message__container ${mes.sender === user.username ? 'message__container--right' : 'message__container--left'}`}
                style={{marginBottom: i == messages.length - 1 ?  0 : '1em'}}

              >
                <div className="message__data">
                  <div className="message__time">{mes.time}</div>
                  <div className="message__content">{mes.message}</div>
                  {mes.sender !== user.username && 
                    <div className="message__name">{mes.sender}</div>
                  }
                </div>
              </div>
            )
          })
        }        
        <div ref={messagesEndRef} />
      </div>
    </div>
  )

}

export default Messages;