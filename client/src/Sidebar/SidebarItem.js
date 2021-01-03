import React from 'react'

export default function SidebarItem(props) {
  const { activeSidebar, name, lastMessage, active, onClick } = props;
console.log(activeSidebar)
  return (
    <div
      className={`chat__item ${active ? 'active' : ''}`}
      onClick={() => onClick()}
    >
      <div className="chat__photo">{name[0]}</div>
      <div className="chat__info">
        <p>{name}</p>
        <div className="chat__last-message">
          { lastMessage ?
            <p>{lastMessage.sender}: {lastMessage.message}</p>
          :
            activeSidebar === 'chats' &&
            <p>No Messages</p>
          }
        </div>
      </div>
    </div>
  )
}
