
import React from 'react';
import ReactDOM from 'react-dom';
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
          <AccountComponent />
        </div>
      </div>
    );
  }
}

class Home extends React.Component {
  render() {
    console.log('Home');
    return (
      <div className="web-body">Home</div>
    );
  }
}

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

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path="inbox" component={Inbox} />
      <Route path="about" component={About} />
      <IndexRoute component={Home} />
    </Route>
  </Router>),
  document.getElementById('container')
);