import React, { useRef, useEffect } from 'react';

const Messages = (props) => {
  const { messages, user } = props;
  const messagesEndRef = useRef(null);

  const scrollToBottom = () =>{
    messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages.length]);

  return (
    <div className="thread__container">
      <div className="thread__content">
        {messages &&
          messages.map((mes, i) => {
            return(
              <div
                key={mes.id}
                className={`message__container ${mes.sender === user.username ? 'message__container--right' : 'message__container--left'}`}
                style={{marginBottom: i === messages.length - 1 ?  0 : '1em'}}

              >
                <div className="message__data">
                  {mes.sender !== user.username && 
                    <div className="message__name--avatar">{mes.sender[0]}</div>
                  }
                  <div className="message__content-container content">
                    <div className="content__top">
                      { mes.sender !== user.username && 
                        <div className="message__name">{mes.sender}</div>
                      } 
                      <div className="message__time">{mes.time}</div>
                    </div>
                    <div className="message__content">{mes.message}</div>

                  </div>
               
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