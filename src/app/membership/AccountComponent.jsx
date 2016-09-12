import React from 'react';
import ReactDOM from 'react-dom';

import Mask from '../../shared/layouts/Mask';

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

class AccountList extends React.Component {
  /**
   * 构造函数
   */
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { "name": "名称" },
        { "name": "状态", "width": "60px" },
        { "name": "操作", "width": "60px" },
        { "name": "编辑", "width": "30px", icon: "fa fa-edit" },
        { "name": "复制", "width": "30px", icon: "fa fa-copy" },
        { "name": "删除", "width": "30px", icon: "fa fa-trash" }
      ],
      data: []
    };
  }

  /**
   * 组件加载完事件  
   */
  componentDidMount() {
    $.get(this.props.source, function (result) {
      console.log(result);
      this.setState({ data: result.data });
      this.refs.grid.setState({ data: result.data });
    }.bind(this));
  }

  /**
   * 组件渲染事件  
   */
  render() {
    return (
      <div id="window-main-table-container">
        <Grid key={this.state.data} columns={this.state.columns} data={this.state.data} ref="grid"></Grid>
        {
          this.state.data.map(function (item) {
            // console.log(item);
            return <div key={item.name}>{item.name}</div>
          })
        }
      </div>
    );
  }
}

var styleBorder = { border: '1px solid #ff0' };

class AccountForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: this.props.name };
    this.handleChange = this.handleChange.bind(this);
  }


  render() {
    return (
      <div style={styleBorder}>
        name: {this.state.name}
        <form className="AccountForm">
          <input type="text" placeholder="Your name" value={this.state.name} onChange={this.handleChange.bind(this) } />
          <input type="text" placeholder="Say something..." />
          <input type="submit" value="Post" />
          <button id="" >确定</button>
        </form>
      </div>
    );
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }
}

export default AccountComponent;
