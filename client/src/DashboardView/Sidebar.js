import React, { useState } from 'react';

import { 
  FiMoreVertical, 
  FiLogOut, 
  FiChevronDown, 
  FiPlus,
  FiSearch
} from "react-icons/fi";

import './DashboardView.scss';

const Sidebar = (props) => {
  const { handleLogout, chats, user, activeChat, setActiveChat, onSendPrivateMessage } = props;

  const [receiver, setReceiver] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendPrivateMessage(receiver);
    setReceiver('');
  }

  return (
    <div className="chats__sidebar">
      <div className="chats__header header">
        <div className="header__left">
          <h4>My Chats</h4>
          <FiChevronDown />
        </div>

        <div className="header__right">
          <FiMoreVertical />
        </div>
      </div>

      <div>
        <form onSubmit={handleSubmit} className=" chats__add-chat add-chat">
          <div className="add-chat__input">
            <FiSearch />
            <input
              placeholder="Chat name..."
              type='text'
              onChange={(e) => setReceiver(e.target.value)}
              value={receiver}
            />
          </div>
          <button type="submit" className="add-chat__btn">
            <FiPlus />
          </button>
        </form>

        
      </div>

      <div className="chats__content">
        {chats && chats.map((chat) => {
          if(chat.name){
            const lastMessage = chat.messages[chat.messages.length - 1];
            const chatName = chat.users.find((username) => {
              return username !== user.username
            }) || 'Community'
            const classNames = (activeChat && activeChat.id === chat.id ? 'active' : '');

            return (
              <div
                key={chat.id}
                className={`chat__item ${classNames}`}
                onClick={() => setActiveChat(chat)}
              >
                <div className="chat__photo">{chatName[0]}</div>
                <div className="chat__info">
                  <p>{chatName}</p>
                  <div className="chat__last-message">
                    {lastMessage ?
                      <p>{lastMessage.message}</p>
                    :
                      <p>No Messages</p>
                    }
                  </div>
                </div>
              </div>
            )
          }
          return null;

        })}
      </div>

      <div className="chats__footer footer">
        <div className="footer__left">
          <p>{ user.username }</p>
        </div>

        <div className="footer__right">
          <div 
            className="footer__btn footer__btn--logout"
            onClick={() => handleLogout()}
          >
            <FiLogOut />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar;