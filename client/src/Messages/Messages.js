import React from 'react';

const Messages = (props) => {
  const { messages, user, typingUsers } = props;

  return (
    <div className="thread__container">
      <div className="thread__content">
        {messages &&
          messages.map((mes, i) => {
            return(
              <div
                key={mes.id}
                className={`message__container ${mes.sender === user.username ? 'message__container--right' : 'message__container--left'}`}
              >
                <div className="message__data">
                  <div className="message__time">{mes.time}</div>
                  <div className="message__content">{mes.message}</div>
                  <div className="message__name">{mes.sender}</div>
                </div>
              </div>
            )
          })
        }

        {typingUsers && 
          typingUsers.map((name) => {
            return(
              <div key={name} className="message__typing-user">
                {`${name} is typing...`}
              </div>
            )
          })

        }
      </div>
    </div>
  )

}

export default Messages;