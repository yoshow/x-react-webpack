
import app from './config'

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'

import TopContainer from '../shared/layouts/TopContainer';
import ApplicationMenu from '../shared/layouts/ApplicationMenu';
import ApplicationMenuHandleBar from '../shared/layouts/ApplicationMenuHandleBar';

import AccountComponent from './Membership/AccountComponent';

class AppView extends React.Component {
  /**
   * 构造函数
   */
  constructor(props) {
    super(props);
  }

  /**
   * 构造函数
   */
  render() {
    console.log('App');
    x.debug.log(app);

    if (!localStorage['session-access-token']) {
      location.href = "account/sign-in.html?returnUrl=" + location.href;
      return;
    }

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

class DetailView extends React.Component {
  /**
   * 构造函数
   */
  constructor(props) {
    super(props);
  }

  /**
   * 构造函数
   */
  render() {
    console.log('DetailView');
    return (
      <div className="web-body">
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

const AccountPkg = ({ children }) => (
  <div>
    <h2>Account</h2>
    {children}
  </div>
)

render((
  <Router history={hashHistory}>
    <Route path="/" component={AppView}>
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