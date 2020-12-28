import React, { useState } from 'react'
import useChat from '../hooks/useChat';

import DashboardView from '../DashboardView/DashboardView';
import LoginView from '../LoginView/LoginView';

import './Layout.scss';

export default function Layout() {
  const { socket, logoutUser } = useChat();
  const [user, setUser] = useState(null);

  const handleSetUser = (user) => {
    setUser(user)
  }

  const handleLogout = (user) => {
    logoutUser(user);
    setUser(null);
  }

  return (
    <div className="layout__container">
      {user ?
        <DashboardView
          socket={socket}
          user={user}
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
