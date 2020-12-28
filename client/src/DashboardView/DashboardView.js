import React, { useEffect, useState } from 'react';
import useChat from '../hooks/useChat';

import Sidebar from './Sidebar';
import ChatHeading from './ChatHeading';
import Messages from '../Messages/Messages';
import MessageInput from '../Messages/MessageInput';

import { MESSAGE_RECEIVED, MESSAGE_SENT, TYPING } from '../Events';

import './DashboardView.scss';

export default function DashboardView(props) {
  const { socket, user, handleLogout } = props;
  const { setCommunity } = useChat();

  const [chats, setChats] = useState(null);
  const [activeChat, setActiveChat] = useState(null);

  /*
  *  Returns a function that will add message to chat with 
  *  chatId passed in.
  *  @param chatId {number}
  */
  function handleAddMessageToChat(chats, chatId, message) {
    let newChats = chats.map(chat => {
      if(chat.id === chatId) {
        chat.messages.push(message);
      }
      return chat;
    });

    setChats(newChats);      
  }

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
    const newChats = reset ? [chat] : [...chats, chat];

    setChats(newChats);
    setActiveChat(reset ? chat : activeChat);

    const messageEvent = `${MESSAGE_RECEIVED}-${chat.id}` //MESSAGE_RECEIVED-asdfjksnfsdf-sdfsfjksdf
    const typingEvent = `${TYPING}-${chat.id}`;
    
    socket.on(messageEvent, (message) => handleAddMessageToChat(newChats, chat.id, message));
    socket.on(typingEvent, ({isTyping, sender}) => updateTypingInChat(newChats, chat.id, isTyping, sender))
  };

  /**
   * Reset the chat to new incoming messages only
   * @param chat {Chat} 
  */
  function handleResetChat(chat) {
    return handleAddChat(chat, true);
  };

  /**
   * Updates the typing in the specified chat
   * @param {string} chatId 
  */
  const updateTypingInChat = (chats, chatId, isTyping, sender) => {
    if(sender !== user.username){
      let newChats = chats.map(chat => {
        if(chat.id === chatId) {
          if(isTyping && !chat.typingUsers.includes(sender)){
            chat.typingUsers.push(sender);
          }else if(!isTyping && chat.typingUsers.includes(sender)){
            chat.typingUsers = chat.typingUsers.filter(u => u !== sender)
          }
        }
        return chat;
      });
      setChats(newChats);      
    }
  }

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
      setCommunity(handleResetChat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="chats__container">
      <Sidebar 
        handleLogout={handleLogout}
        chats={chats}
        user={user}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
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

            { activeChat.typingUsers && 
              activeChat.typingUsers.map((name) => {
                return(
                  <div key={name} className="message__typing-user">
                    {`${name} is typing...`}
                  </div>
                )
              })

            }
            
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
