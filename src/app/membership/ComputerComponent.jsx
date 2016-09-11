import React from 'react';
import ReactDOM from 'react-dom';

import MainContainer from '../../shared/layouts/MainContainer';
import Grid from '../../shared/layouts/Grid';
import Mask from '../../shared/layouts/Mask';

import { Router, Route, IndexRoute, Link, hashHistory, applyRouterMiddleware } from 'react-router'

class ComputerList extends React.Component {
  /**
   * 构造函数
   */
  constructor(props) {
    super(props);

    x.debug.log('membership.computer.list.constructor');

    // 分页对象
    this.paging = x.page.newPagingHelper(50);

    // 设置 Button 信息
    this.buttons = [{ name: 'btnCreate', label: '新增', icon: '', handle: function () { console.log('button create'); } }];

    // 设置 State 信息
    this.state = {
      columns: [
        {
          reactKey: 0, "name": "名称", "width": "160px", "field": "name",
          render: function (node) {
            // return <Link to={'/membership/computer/form/' + node.id}>{node.name}</Link>;
            return <a href="javascript:void(0)" onClick={() => { this.edit(node.id) } }>{node.name}</a>;
          }.bind(this)
        },
        {
          reactKey: 1, "name": "IP(MAC)", "field": "ip",
          render: function (node) { return node.ip + '(' + node.mac + ')'; }
        },
        {
          reactKey: 3, "name": "修改日期", "width": "100px", "field": "modifiedDate",
          render: function (node) { return x.date.newTime(node.modifiedDate).toString('yyyy-MM-dd'); }
        },
        {
          reactKey: 4, "name": "删除", "width": "30px", icon: "fa fa-trash", action: true,
          handle: function (node) { this.confirmDelete(node.id); }.bind(this)
        }
      ],
      data: []
    };
  }

  /**
   * 组件加载完事件  
   */
  componentDidMount() {

    this.getPaging(1);

    masterpage.resize();
  }

  /**
   * 组件渲染事件  
   */
  render() {
    x.debug.log('membership.computer.list.render');
    return (
      <MainContainer name="计算机管理" buttons={ this.buttons } tree={ this.tree } pagingData={this.paging} pagingHandle={(value) => { this.getPaging(value) } } ref="main" >
        <Grid key={this.state.data} columns={this.state.columns} data={this.state.data} ref="grid"></Grid>
      </MainContainer>
    );
  }

  /*#region 函数:filter()*/
  /**
   * 查询
   */
  filter() {
    this.paging.query.scence = 'Query';
    this.paging.query.where.SearchText = $('#searchText').val().trim();
    this.paging.query.orders = ' OrderId ';
    this.getPaging(1);
  }
  /*#endregion*/

  /*#region 函数:getPaging(currentPage)*/
  /** 
  * 分页
  */
  getPaging(currentPage) {
    this.paging.currentPage = currentPage;

    var outString = '<?xml version="1.0" encoding="utf-8" ?>';

    outString += '<request>';
    outString += this.paging.toXml();
    outString += '</request>';

    x.net.xhr('/api/membership.computer.query.aspx', outString, {
      waitingType: 'mini',
      waitingMessage: i18n.strings.msg_net_waiting_query_tip_text,
      callback: function (response) {

        var result = x.toJSON(response);

        // 设置 reactKey 
        result.data.forEach(function (node) {
          node.reactKey = node.name;
        });

        this.paging.load(result.paging);

        this.refs.main.setState({ pagingData: this.paging });

        this.refs.grid.setState({ data: result.data });
      }.bind(this)
    });
  }

  edit(id) {
    console.log('edit - ' + id);
    this.renderModel(this.props);
  }

  renderModel(props) {
    if (this.container == null) {
      this.container = document.createElement('div');

      document.body.appendChild(this.container);
    }

    var obj = (
      <Mask name="abc" >
        <ComputerForm props={props} />
      </Mask>
    );

    this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(this, obj, this.container);
  }
}

class ComputerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: this.props.name };
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <div>
        name: {this.state.name}
        名称 <input id="name" type="text" placeholder="Your name" value={this.state.name} onChange={this.handleChange.bind(this) } />
        IP <input id="ip" type="text" placeholder="Say something..." />
        <input type="submit" value="Post" />
        <button id="" >确定</button>
      </div>
    );
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }
}

export { ComputerList, ComputerForm };