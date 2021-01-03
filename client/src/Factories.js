const {v4: uuidv4} = require('uuid');

/**
 * createChatNameFromUsers
 * @param {Array.string} users 
 * @param {string} excludedUser
 * @return {string} user's names concatenated by a '&' or "Empty chat" if not users
*/
const createChatNameFromUsers = (users, excludedUser = "") => {
  return users.filter(u => u !== excludedUser).join(' & ') || "Empty chat"
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
function createChat({messages = [], name, users = [], isCommunity = false} = {}) {
  return (
    {
      id: uuidv4(),
      name: isCommunity ? "Community" : createChatNameFromUsers(users),
      messages,
      users,
      typingUsers: [],
      isCommunity
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
* createUser
* Creates user object to be saved to list of users
* @param username {String} Chosen username
* @return user {Object} Object with user's id, username
*/
function createUser(username, socketId = null){
  return {
    id: uuidv4(),
    username,
    socketId
  }
}

/*
*  @param date {Date}
*  @return a string represented in 24hr time
*/
function getTime(date) {
  return `${date.getHours()}:${(('0' + date.getMinutes()).slice(-2))}`
}

module.exports = {
  createChat,
  createMessage,
  createUser,
  createChatNameFromUsers
}