import React, { useCallback, useEffect, useState } from 'react';

import Sidebar from './Sidebar';
import ChatHeading from './ChatHeading';
import Messages from '../Messages/Messages';
import MessageInput from '../Messages/MessageInput';

import { 
  MESSAGE_RECEIVED, 
  MESSAGE_SENT, 
  TYPING, 
  PRIVATE_MESSAGE,
  COMMUNITY_CHAT,
  UPDATE_CHAT
} from '../Events';

import './DashboardView.scss';

export default function DashboardView(props) {
  const { user, socket, handleLogout } = props;

  const [isTypingObj, setIsTypingObj] = useState(null);
  const [messageObj, setMessageObj] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [incomingChat, setIncomingChat] = useState(null);
  /*
  *  Returns a function that will add message to chat with 
  *  chatId passed in.
  *  @param chatId {number}
  */
  const handleAddMessageToChat = useCallback((chatId, message) => {
    let newChats = chats.map(chat => {
      if(chat.id === chatId) {
        chat.messages.push(message);
      }
      return chat;
    });

    setChats(newChats);      
  }, [chats])

  useEffect(() => {
    if(messageObj){
      handleAddMessageToChat(messageObj.chatId, messageObj.message);
      return () => {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageObj]);

  /**
   * Updates the typing in the specified chat
   * @param {string} chatId 
  */
  const updateTypingInChat = useCallback((chatId, isTyping, sender) => {    
    if(sender !== user.username){
      let newChats = chats.map(chat => {
        if(chat.id === chatId) {
          if(isTyping && !chat.typingUsers.includes(sender)){
            chat.typingUsers.push(sender);
          }else if(!isTyping && chat.typingUsers.includes(sender)){
            chat.typingUsers = chat.typingUsers.filter(u => u !== sender);
          }
        }
        setActiveChat(chat);
        return chat;
      });

      setChats(newChats);      
    }
  }, [chats, user.username]);

  useEffect(() => {
    if(isTypingObj){
      updateTypingInChat(isTypingObj.chatId, isTypingObj.isTyping, isTypingObj.sender)
      return () => {}
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTypingObj])

  /*
  *  Adds chat to the chat container, if reset is true, 
  *  removes all chats and sets the chat to main chat.
  *  Sets the message and typing socket events for the chat.
  * 
  *  @param chat {Chat} The chat to be added
  *  @param reset {boolean} If true, will set the chat as the 
  *  only chat
  */
  function handleAddChat(chat, reset = false) {
    if(reset){
      setActiveChat(chat)
    }else{
      setActiveChat(activeChat)
    }
    
    setChats(prevChats => ([...prevChats, chat]));

    const messageEvent = `${MESSAGE_RECEIVED}-${chat.id}`;
    const typingEvent = `${TYPING}-${chat.id}`;
    
    socket.on(messageEvent, (message) => setMessageObj({chatId: chat.id, message}));
    socket.on(typingEvent, ({isTyping, sender}) => setIsTypingObj({chatId: chat.id, isTyping, sender}));
  };

  /**
   * Update the chat attributes when new user is added
   * @param {Chat} chat 
  */

  useEffect(() => {
    const found = chats.some(el => el.id === incomingChat.id);
    if(found){
      let currentChats = [...chats];
      const elementIdx = chats.findIndex(el => el.id === incomingChat.id);
      currentChats[elementIdx] = {...incomingChat}

      setChats(currentChats);
      setActiveChat(incomingChat);
    }
    
    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingChat])

  /**
   * Reset the chat to new incoming messages only
   * @param chat {Chat} 
  */
  function handleResetChat(chat) {
    return handleAddChat(chat, true);
  };

  /*
  *  Adds a message to the specified chat
  *  @param chatId {number} The id of the chat to be added to
  *  @param message {string} The message to be added to the chat
  */
  function handleSendMessage (chatId, message) { 
    let sender = user.username;
    socket.emit(MESSAGE_SENT, {chatId, message, sender});
  };

  /*
  *  Sends typing status to the server
  *  @param chatId {number} The id of the chat being typed on
  *  @param typing {boolean} If user is typing
  */
  const handleSendTyping = (chatId, isTyping) => {
    let sender = user.username;
    socket.emit(TYPING, {chatId, isTyping, sender});
  }

  useEffect(() => {
    if(socket){
      socket.emit(COMMUNITY_CHAT, handleResetChat);
      socket.on(PRIVATE_MESSAGE, handleAddChat);
      socket.on(UPDATE_CHAT, (chat) => setIncomingChat(chat) )
      return () => { socket.off(PRIVATE_MESSAGE) }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  function sendOpenPrivateMessage(receiver){
    let sender = user.username;
    
    socket.emit(PRIVATE_MESSAGE, {receiver, sender, activeChat})
  }
  
  return (
    <div className="chats__container">
      <Sidebar 
        handleLogout={handleLogout}
        chats={chats}
        user={user}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        onSendPrivateMessage={(receiver) => sendOpenPrivateMessage(receiver)}
      />

      <div className="chats__chat chat">
        {activeChat !== null ? 
          <div className="chat__room">
            <ChatHeading name={activeChat.name} />
            <Messages 
              messages={activeChat.messages.reverse()} 
              user={user}
              typingUsers={activeChat.typingUsers}
            />
            
            <div  className="message__typing-user">
              { activeChat.typingUsers && 
                activeChat.typingUsers.map((name) => {
                  return(
                    <p key={name} >{`${name} is typing...`}</p>
                  )
                })
              }
            </div>

            <MessageInput
              handleSendMessage={message => handleSendMessage(activeChat.id, message)}
              handleSendTyping={isTyping => handleSendTyping(activeChat.id, isTyping)}
            />
          </div>
        :
          <p>Select a chat</p>
        }
      </div>
    </div>
  )
}
