
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'

import TopContainer from '../shared/layouts/TopContainer';
import ApplicationMenu from '../shared/layouts/ApplicationMenu';
import ApplicationMenuHandleBar from '../shared/layouts/ApplicationMenuHandleBar';

import AccountComponent from './Membership/AccountComponent';

class App extends React.Component {
  render() {
    console.log('App');
    return (
      <div className="web-body">
        <div className="header" >
          <div className="header-container" >
            <TopContainer />
          </div>
        </div>
        <div className="header-placeholder" ></div>
        <div className="web-container" >
          <ApplicationMenu />
          <ApplicationMenuHandleBar />
          {this.props.children}
        </div>
      </div>
    );
  }
}

class Home extends React.Component {
  render() {
    console.log('Home');
    return (
          <AccountComponent />
    );
  }
}

const Membership1 = ({ children }) => (
  <div>
    <h2>Membership</h2>
    {children}
  </div>
)

const Account = ({ children }) => (
  <div>
    <h2>Account</h2>
  </div>
)

const AccountList = ({ children }) => (
  <div>
    <h2>AccountList</h2>
  </div>
)

const AccountDetail = ({ children }) => (
  <div>
    <h2>AccountDetail</h2>
  </div>
)

class About extends React.Component {
  render() {
    console.log('About');
    return (
      <div className="web-body">About</div>
    );
  }
}

class Inbox extends React.Component {
  render() {
    console.log('Inbox');
    return (
      <div className="web-body">Inbox</div>
    );
  }
}

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="membership" component={Membership1} >
        <Route path="accounts" component={Account} >
          <IndexRoute component={AccountList} />
          <Route path=":id" component={AccountDetail} />
        </Route>
      </Route>
      <Route path="inbox" component={Inbox} />
    </Route>
  </Router>),
  document.getElementById('container')
);