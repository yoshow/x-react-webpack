
import settings from './settings'

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'

import App from '../shared/layouts/App';
import TopContainer from '../shared/layouts/TopContainer';
import ApplicationMenu from '../shared/layouts/ApplicationMenu';
import ApplicationMenuHandleBar from '../shared/layouts/ApplicationMenuHandleBar';

import Applications from './applications/ApplicationComponent';
import BigDb from './bigdb/ApplicationComponent';

class Home extends React.Component
{
  render()
  {
    console.log('Home');
    return (
      <div className="web-container" >
        <ApplicationMenu applicationId="b69db4ff-9ae4-4269-9260-05e28ea923b5" />
        <ApplicationMenuHandleBar />
        <button>按钮 - A</button>
        <button>按钮 - B</button>
        <BigDb.TerminalComponent />
      </div>
    );
  }
}

const ApplicationsView = ({ children }) => (
  <div>
    <h2>Membership</h2>
    {children}
  </div>
)

class MembershipView extends React.Component
{
  componentDidMount()
  {
    console.log('MembershipView-componentDidMount');
    masterpage.resize();
  }

  render()
  {
    console.log('MembershipView-render');
    return (<div className="web-container" >
      <ApplicationMenu applicationId="00000000-0000-0000-0000-000000000002" />
      <ApplicationMenuHandleBar />
      <div>
        <h2>Membership</h2>
      </div>
      {this.props.children}
    </div>);
  }
}

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

render((
  <Router history={hashHistory}>
    <Route path="/" component={App.AppView}>
      <Route path="applications" component={Applications.ApplicationComponent} >
        <IndexRoute component={Applications.ApplicationList} />
        <Route path="application-option" component={Applications.ApplicationOptionList} >
          <Route path="list" component={Applications.ApplicationOptionList} />
        </Route>
        <Route path="application-method" component={Applications.ApplicationMethodList} >
          <Route path="list" component={Applications.ApplicationMethodList} />
        </Route>
      </Route>
      <Route path="membership" component={MembershipView} >
        <Route path="accounts" component={Account} >
          <IndexRoute component={AccountList} />
          <Route path=":id" component={AccountDetail} />
        </Route>
      </Route>
      <Route path="bigdb" component={BigDb.ApplicationComponent} >
        <IndexRoute component={BigDb.TerminalComponent} />
        <Route path="search" component={BigDb.SearchComponent} />
        <Route path="bank" component={BigDb.BankComponent} >
          <Route path="list" component={BigDb.BankList} />
        </Route>
      </Route>
    </Route>
  </Router>),
  document.getElementById('container')
);