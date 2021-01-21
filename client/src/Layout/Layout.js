import React, { useState, useEffect } from 'react'
import socketIOClient from 'socket.io-client';

import DashboardView from '../DashboardView/DashboardView';
import LoginView from '../LoginView/LoginView';

import {
  LOGOUT
} from '../Events';

import './Layout.scss';

export default function Layout() {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);

  const SOCKET_SERVER_URL = 'http://localhost:5000';
  //const SOCKET_SERVER_URL = 'https://chatter-react-socketio.herokuapp.com';

  useEffect(() => {
    //Create Websocket connection
    const newSocket = socketIOClient(SOCKET_SERVER_URL, {
      transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling'],
      cors: '*'
    });
    
    setSocket(newSocket);
   
    return () => {
      //socketRef.current.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSetUser = (user) => {
    setUser(user)
  }

  const handleLogout = (user) => {
    socket.emit(LOGOUT, user);
    setUser(null);
  }

  return (
    <div className="layout__container">
      {user ?
        <DashboardView
          user={user}
          socket={socket}
          handleLogout={handleLogout}
        />
      :
        <LoginView 
          socket={socket}
          handleSetUser={handleSetUser}
        />
      }
    </div>
  )
}
