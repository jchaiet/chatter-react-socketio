import React, { useState } from 'react';
import SidebarItem from './SidebarItem';

import { createChatNameFromUsers } from '../Factories';

import { 
  FiMoreVertical, 
  FiLogOut, 
  FiChevronDown, 
  FiPlus,
  FiSearch
} from "react-icons/fi";

import './Sidebar.scss';

const Sidebar = (props) => {
  const type = {
    CHATS: "chats",
    USERS: "users"
  }
  const { handleLogout, chats, user, users, activeChat, setActiveChat, onSendPrivateMessage } = props;
  console.log(chats)

  const [receiver, setReceiver] = useState('');
  const [activeSidebar, setActiveSidebar] = useState("chats");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSendPrivateMessage(receiver);
    setReceiver('');
  }

  const addChatForUser = (username) => {
    onSendPrivateMessage(username);
    setActiveSidebar(type.CHATS);
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

      <div className="chats__toggle toggle">
        <div 
          className={`toggle__option ${activeSidebar === 'chats' ? 'active' : ''}` }
          onClick={() => setActiveSidebar(type.CHATS)}
        >
          <p>Chats</p>
        </div>
        <div 
          className={`toggle__option ${activeSidebar === 'users' ? 'active' : ''}` }
          onClick={() => setActiveSidebar(type.USERS)}
        >
          <p>Users</p>
        </div>
      </div>

      <div className="chats__content">
        {activeSidebar === type.CHATS ?
        
          chats.map((chat) => {
            if(chat.name){
              return (
                <SidebarItem
                  key={chat.id}
                  activeSidebar={activeSidebar}
                  active={activeChat && activeChat.id === chat.id}
                  name={chat.isCommunity ? chat.name : createChatNameFromUsers(chat.users, user.username)}
                  lastMessage={chat.messages[chat.messages.length - 1]}
                  onClick={() => setActiveChat(chat)}
                />
              )
            }
            return null;

          })
        :
          users.map((otherUser) => {
            if(otherUser.username !== user.username){
              return (
                <SidebarItem
                  key={otherUser.id}
                  activeSidebar={activeSidebar}
                  name={otherUser.username}
                  onClick={() => addChatForUser(otherUser.username)}
                  lastMessage={null}
                />
              )
            }
            return null;
          })  
        }
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