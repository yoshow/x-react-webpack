
import stylesheet from './main.less';

import settings from './settings'

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory, applyRouterMiddleware } from 'react-router'
import { useTransitions, withTransition } from 'react-router-transitions';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import App from '../shared/layouts/App';
import TopContainer from '../shared/layouts/TopContainer';
import ApplicationMenu from '../shared/layouts/ApplicationMenu';
import ApplicationMenuHandleBar from '../shared/layouts/ApplicationMenuHandleBar';

import NoMatch from './sys/NoMatchComponent';
import Applications from './applications/ApplicationComponent';
import Membership from './membership/ApplicationComponent';
import BigDb from './bigdb/ApplicationComponent';

render((
  <Router history={hashHistory}
    render={applyRouterMiddleware(useTransitions({
      TransitionGroup: ReactCSSTransitionGroup,
      onShow(prevState, nextState, replaceTransition) {
        return {
          transitionName: `show-${nextState.children.props.route.transition}`,
          transitionEnterTimeout: 500,
          transitionLeaveTimeout: 300,
        };
      },
      onDismiss(prevState, nextState, replaceTransition) {
        return {
          transitionName: `dismiss-${prevState.children.props.route.transition}`,
          transitionEnterTimeout: 500,
          transitionLeaveTimeout: 300,
        };
      },
      defaultTransition: {
        transitionName: 'fade',
        transitionEnterTimeout: 500,
        transitionLeaveTimeout: 300,
      }
    })) }>
    <Route path="/" component={App.AppView}>
      <Route path="applications" component={Applications.ApplicationComponent} >
        <IndexRoute component={Applications.ApplicationList} />
        <Route path="application-option/list" component={Applications.ApplicationOptionList} />
        <Route path="application-feature/list" component={Applications.ApplicationFeatureList} />
        <Route path="application-setting-group/list" component={Applications.ApplicationSettingGroupList} />
        <Route path="application-setting/list" component={Applications.ApplicationSettingList} />
        <Route path="application-menu/list" component={Applications.ApplicationMenuList} />
        <Route path="application-menu/form/:id" component={Applications.ApplicationMenuForm} />
        <Route path="application-method" component={Applications.ApplicationMethodList} >
          <Route path="list" component={Applications.ApplicationMethodList} />
        </Route>
        <Route path="application-event" component={Applications.ApplicationEventList} >
          <Route path="list" component={Applications.ApplicationEventList} />
        </Route>
      </Route>
      <Route path="membership" component={Membership.ApplicationComponent} >
        <IndexRoute component={Membership.AccountList} />
        <Route path="account/list" component={Membership.AccountList} />
        <Route path="group/list" component={Membership.GroupList} />
        <Route path="organization/list" component={Membership.OrganizationUnitList} />
        <Route path="role/list" component={Membership.RoleList} />
        <Route path="computer/list" component={Membership.ComputerList} />
        <Route path="catalog/list" component={Membership.CatalogList} />
      </Route>
      <Route path="bigdb" component={BigDb.ApplicationComponent} >
        <IndexRoute component={BigDb.TerminalComponent} />
        <Route path="search" component={BigDb.SearchComponent} />
        <Route path="bank/list" component={BigDb.BankList} />
      </Route>
      {/**<Route path="bigdb" component={BigDb.ApplicationComponent} >
        <IndexRoute component={BigDb.TerminalComponent} />
        <Route path="search" component={BigDb.SearchComponent} />
        <Route path="bank" component={BigDb.BankComponent} >
          <Route path="list" component={BigDb.BankList} />
        </Route>
      </Route>*/}
    </Route>
    <Route path="*" component={NoMatch}/>
  </Router>),
  document.getElementById('container')
);