const io = require('./server.js').io;
const {v4: uuidv4} = require('uuid');

const VERIFY_USER = "VERIFY_USER";
const USER_CONNECTED = "USER_CONNECTED";
const USER_DISCONNECTED = "USER_DISCONNECTED";
const COMMUNITY_CHAT = "COMMUNITY_CHAT";
const LOGOUT = "LOGOUT";
const MESSAGE_SENT = "MESSAGE_SENT";
const MESSAGE_RECEIVED = "MESSAGE_RECEIVED";
const TYPING = "TYPING";
const PRIVATE_MESSAGE = "PRIVATE_MESSAGE"
const UPDATE_CHAT = "UPDATE_CHAT";

const { createChat, createMessage, createUser } = require('./client/src/Factories')

let connectedUsers = {};

let sendMessageToChatFromUser;

let communityChat = createChat({ isCommunity: true })

module.exports = function(socket){
  console.log(`Socket Id: ${socket.id}`);
  
  //Verify username is not taken
  socket.on(VERIFY_USER, (username, callback) => {
    if(isUser(connectedUsers, username)){
      callback({isUser: true, user: null});
    }else{
      callback({isUser: false, user: createUser(username, socket.id)})
    }
  });

  //User connects with username
  socket.on(USER_CONNECTED, (user) => {
    user.socketId = socket.id;

    connectedUsers = addUser(connectedUsers, user);
    socket.user = user;
    sendMessageToChatFromUser = sendMessageToChat(socket.user.username);

    io.emit(USER_CONNECTED, connectedUsers);
    console.log(connectedUsers);
  });

  //Set community chat
  socket.on(COMMUNITY_CHAT, (callback) => {
    callback(communityChat);
  });

  //Private message
  socket.on(PRIVATE_MESSAGE, ({receiver, sender, activeChat}) => {
    if(receiver in connectedUsers){
      const receiverSocket = connectedUsers[receiver].socketId;

      if(activeChat === null || activeChat.id === communityChat.id) {
        //Create new chat
        const newChat = createChat({messages: [], name: ` ${sender} & ${receiver}`, users: [receiver, sender]});
        socket.to(receiverSocket).emit(PRIVATE_MESSAGE, newChat);
        socket.emit(PRIVATE_MESSAGE, newChat);
      }else{
        //Add user to activeChat
        if(!activeChat.users.includes(receiver)){
          activeChat.users.push(receiver);
          activeChat.name = activeChat.name + ' & ' + receiver;
          activeChat.messages = activeChat.messages;
          activeChat.typingUsers = activeChat.typingUsers;
          socket.to(receiverSocket).emit(PRIVATE_MESSAGE, activeChat);

          for(user of activeChat.users){
            if(user !== sender && user !== receiver){
              const userSocket = connectedUsers[user].socketId;
              socket.to(userSocket).emit(UPDATE_CHAT, activeChat);
            }
          }
        }
        
        socket.emit(UPDATE_CHAT, activeChat);
      }
    }
  })

  //When message is sent
  socket.on(MESSAGE_SENT, ({chatId, message, sender}) => {
    sendMessageToChat(chatId, message, sender);
  })

  //When a user is typing
  socket.on(TYPING, ({chatId, isTyping, sender}) => {
    sendTypingToChat(chatId, isTyping, sender);
  })

  //User logout
  socket.on(LOGOUT, () => {
    if("user" in socket){
      connectedUsers = removeUser(connectedUsers, socket.user.username);

      io.emit(USER_DISCONNECTED, connectedUsers);
      console.log('logout:', connectedUsers); 
    }
  });
}

/**
 * Returns a function that will take a chat id and a boolean isTyping
 * and then emit a broadcast to the chat where the user is typing
 * @param {string} sender 
 * @return function(chatId, message)
*/
function sendTypingToChat(chatId, isTyping, sender){
  io.emit(`${TYPING}-${chatId}`, {isTyping, sender});
}

/**
 * Returns a function that will take a chat id and message
 * then emit a broadcast to the chat id
 * @param {string} sender username of sender
 * @return function(chatId, message)
*/
function sendMessageToChat(chatId, message, sender){
  io.emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({message, sender}));
}

/*
  * isUser
  * Checks if the user is in the list passed in
  * @param userList {Object} Object with key value pairs of Users
  * @param username {String}
  * @return userList {Object} Objct with key value pairs of Users 
  */
 function isUser(userList, username){
  return username in userList;
}

/*
* addUser
* Adds user from the list passed in
* @param userList {Object} Object with key value pairs of Users
* @param user {User} user object to be added
* @return userList {Object} Object with key value pairs of Users 
*/
function addUser(userList, user){
  let newList = Object.assign({}, userList);
  newList[user.username] = user;
  return newList;
}

/*
* removeUser
* Removes user from the list passed in
* @param userList {Object} Object with key value pairs of Users
* @param username {String} username of user to be removed
* @return userList {Object} Objct with key value pairs of Users 
*/
function removeUser(userList, username){
  let newList = Object.assign({}, userList);
  delete newList[username];
  return newList;
}