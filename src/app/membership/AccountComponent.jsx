import React from 'react';
import ReactDOM from 'react-dom';

import Mask from '../../shared/layouts/Mask';

import AccountForm from './AccountForm';
import AccountList from './AccountList';

class AccountComponent extends React.Component
{
  componentDidMount()
  {
    this.div = document.createElement('div');
    document.body.appendChild(this.div);
    // this.renderModel(this.props);
  }

  render()
  {
    return (
      <div id="window-container" className="window-container">
        <div id="window-main-table" className="table">
          <div id="window-main-table-header" className="table-header x-freeze-height">
            <div id="toolbar" className="table-toolbar">
              <button id="btnCreate" className="btn btn-default" onClick={this.handleClick.bind(this) }>新增</button>
            </div>
            <span>人像库列表</span>
            <input id="statusList" type="hidden" value="@ViewBag.status" />
          </div>
          <div id="window-main-table-body" className="table-body">
            <div className="table-row-filter form-inline text-right x-freeze-height">
              <input id="searchText" type="text" value="" className="form-control input-sm" />
              <button id="btnFilter" className="btn btn-default btn-sm" title="查询"><i className="glyphicon glyphicon-search"></i></button>
            </div>
            <AccountList source="/data/accounts.json" />
          </div>
          <div id="window-main-table-footer" className="table-footer x-freeze-height"></div>
        </div>
      </div>
    );
  }

  handleClick(event)
  {
    console.log('click');
    this.renderModel(this.props);
  }

  renderModel(props)
  {
    var obj = (
      <Mask >
        <AccountForm props={props} />
      </Mask>
    );

    this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(this, obj, this.div);
  }
}

export default AccountComponent;
