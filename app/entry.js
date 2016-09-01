
import React from 'react';
import ReactDOM from 'react-dom';

import AccountComponent from './Membership/AccountComponent';

/*
class HelloWorld extends React.Component {
  render() {
    return <p>Hello, world!</p>;
  }
}
*/

// export default HelloWorld;

ReactDOM.render(
  <AccountComponent />,
  document.getElementById('container')
);