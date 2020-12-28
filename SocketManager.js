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
      callback({isUser: false, user: createUser(username)})
    }
  });

  //User connects with username
  socket.on(USER_CONNECTED, (user) => {
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user;
    sendMessageToChatFromUser = sendMessageToChat(socket.user.username);

    io.emit(USER_CONNECTED, connectedUsers);
    console.log(connectedUsers);
  });

  //User disconnects
  /*socket.on('disconnect', () => {
    if("user" in socket){
      connectedUsers = removeUser(connectedUsers, socket.user.username);

      io.emit(USER_DISCONNECTED, connectedUsers);
      console.log("disconnect: ", connectedUsers);
    }
  });*/

  //Set community chat
  socket.on(COMMUNITY_CHAT, (callback) => {
    callback(communityChat);
  });

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
    connectedUsers = removeUser(connectedUsers, socket.user.username);

    io.emit(USER_DISCONNECTED, connectedUsers);
    console.log('logout:', connectedUsers); 
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
* createUser
* Creates user object to be saved to list of users
* @param username {String} Chosen username
* @return user {Object} Object with user's id, username
*/
function createUser(username){
  return {
    id: uuidv4(),
    username
  }
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

/*
*  createChat
*  Creates a messages object
*  @prop id {string}
*  @prop name {string}
*  @prop messages {Array.Message} 
*  @prop users {Array.string}
*  @param {object}
*    messages {Array.messages}
*    name {string}
*    users {Array.string}
*/
function createChat({messages = [], name = 'Community', users = []} = {}) {
  return (
    {
      id: uuidv4(),
      name,
      messages,
      users,
      typingUsers: []
    }
  )
}

/*
*  createMessage
*  Creates a messages object
*  @prop id {string}
*  @prop time {Date} 24-hour format
*  @prop message {string} message text as string
*  @prop sender {string} sender of the message
*  @param {object}
*    message {string}
*    sender {string}
*/
const createMessage = ({message = '', sender = ''} = {}) => (
  {
    id: uuidv4(),
    time: getTime(new Date(Date.now())),
    message,
    sender
  }
)

/*
*  @param date {Date}
*  @return a string represented in 24hr time
*/
function getTime(date) {
  return `${date.getHours()}:${(('0' + date.getMinutes()).slice(-2))}`
}