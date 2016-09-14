import settings from '../settings'

import React from 'react';
import ReactDOM from 'react-dom';

import Grid from '../../shared/layouts/Grid';
import Mask from '../../shared/layouts/Mask';
import MainContainer from '../../shared/layouts/MainContainer';

import ApplicationMenu from '../../shared/layouts/ApplicationMenu';
import ApplicationMenuHandleBar from '../../shared/layouts/ApplicationMenuHandleBar';

import { OrganizationUnitList } from './OrganizationUnitComponent';
import { RoleList } from './RoleComponent';
import { AccountList } from './AccountComponent';
import { ComputerList, ComputerForm } from './ComputerComponent';

class ApplicationComponent extends React.Component {
  componentDidMount() {
    this.div = document.createElement('div');
    document.body.appendChild(this.div);
    // this.renderModel(this.props);
  }

  render() {
    x.debug.log('application.render');
    x.debug.log(this.props.children);
    return (
      <div className="web-container" >
        <ApplicationMenu applicationId={settings.applications["Membership"]} />
        <ApplicationMenuHandleBar />
        {
          (() => {
            if (this.props.children == null) {
              return <div></div>
            }
            else {
              return this.props.children
            }
          })()
        }
      </div>
    );
  }
}

export default {
  ApplicationComponent,
  OrganizationUnitList,
  RoleList,
  ComputerList,
  ComputerForm
};