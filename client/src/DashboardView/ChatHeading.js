import React from 'react';

import './DashboardView.scss';

const ChatHeading = (props) => {
  const { name, numberOfUsers } = props;

  return (
    <div className="chat__header header">
      <div className="header__contain">
        <h3>{name}</h3>
        <div className="header__status status">
          <div className="status__indicator"></div>
          <span>{numberOfUsers ? numberOfUsers : null}</span>
        </div>
      </div>
    </div>
  )

}

export default ChatHeading;