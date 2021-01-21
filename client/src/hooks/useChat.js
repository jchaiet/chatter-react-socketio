import {useEffect, useRef, useState} from 'react';
import socketIOClient from 'socket.io-client';

import {
  COMMUNITY_CHAT,
  USER_CONNECTED,
  VERIFY_USER,
  LOGOUT
} from '../Events';

const SOCKET_SERVER_URL = 'https://chatter-react-socketio.herokuapp.com/';
//const SOCKET_SERVER_URL = 'http://localhost:5000';

const useChat = () => {
  const socketRef = useRef();
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    //Create Websocket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling'],
      cors: '*'
    });
    
    setSocket(socketRef.current);
   
    return () => {
      //socketRef.current.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  //Verify username is available
  const verifyUsername = (username, callback) => {
    socketRef.current.emit(VERIFY_USER, username, callback);
  }

  //User connects with username
  const connectUser = (user) => {
    socketRef.current.emit(USER_CONNECTED, user);

    setUser(user);
  }

  //Sets community chat
  const setCommunity = (callback) => {
    socketRef.current.emit(COMMUNITY_CHAT, callback);
  }

  //Log out the user
  const logoutUser = (user) => {
    socketRef.current.emit(LOGOUT, user);
  }

  return { socket, user, verifyUsername, connectUser, setCommunity, logoutUser }
}

export default useChat;