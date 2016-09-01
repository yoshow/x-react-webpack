import React from 'react';

import AccountForm from './AccountForm';
import AccountList from './AccountList';

class AccountComponent extends React.Component {
  render() {
    return (
      <div className="AccountBox">
        <h1>Accounts</h1>
        <AccountList source="/build/test.json" />
        <AccountForm name="name1" />
        <AccountForm name="name2" />
      </div>
    );
  }
}

export default AccountComponent;