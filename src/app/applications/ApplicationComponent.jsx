import settings from '../settings'

import React from 'react';
import ReactDOM from 'react-dom';

import Grid from '../../shared/layouts/Grid';
import Mask from '../../shared/layouts/Mask';
import MainContainer from '../../shared/layouts/MainContainer';

import ApplicationMenu from '../../shared/layouts/ApplicationMenu';
import ApplicationMenuHandleBar from '../../shared/layouts/ApplicationMenuHandleBar';

import { ApplicationOptionList } from './ApplicationOptionComponent';
import { ApplicationMethodList } from './ApplicationMethodComponent';

class ApplicationComponent extends React.Component
{
  componentDidMount()
  {
    this.div = document.createElement('div');
    document.body.appendChild(this.div);
    // this.renderModel(this.props);
  }

  render()
  {
    x.debug.log('application.render');
    x.debug.log(this.props.children);
    return (
      <div className="web-container" >
        <ApplicationMenu applicationId={settings.applications["ApplicationManagement"]} />
        <ApplicationMenuHandleBar />
        {this.props.children}
      </div>
    );
  }
}

class ApplicationList extends React.Component
{
  /**
   * 构造函数
   */
  constructor(props)
  {
    super(props);
    this.state = {
      columns: [
        {reactKey: 0, "name": "名称", "field": "applicationName" },
        {reactKey: 1, "name": "状态", "width": "60px" },
        {reactKey: 2, "name": "操作", "width": "60px" },
        {reactKey: 3, "name": "编辑", "width": "30px", icon: "fa fa-edit" },
        {reactKey: 4, "name": "复制", "width": "30px", icon: "fa fa-copy" },
        {reactKey: 5, "name": "删除", "width": "30px", icon: "fa fa-trash" }
      ],
      data: []
    };
  }

  /**
   * 组件加载完事件  
   */
  componentDidMount()
  {
    var paging = x.page.newPagingHelper(50);

    var outString = '<?xml version="1.0" encoding="utf-8" ?>';

    outString += '<request>';
    outString += paging.toXml();
    outString += '</request>';

    var me = this;

    x.net.xhr('/api/application.query.aspx', outString, {
      waitingType: 'mini',
      waitingMessage: i18n.strings.msg_net_waiting_query_tip_text,
      callback: function (response)
      {
        var result = x.toJSON(response);

        // 设置 reactKey 
        result.data.forEach(function (node)
        {
          node.reactKey = node.id;
        });

        // var paging = main.applications.home.paging;

        // var list = result.data;

        paging.load(result.paging);

        // me.setState({ data: result.data });
        me.refs.grid.setState({ data: result.data });

        // var containerHtml = main.applications.home.getObjectsView(list, paging.pageSize);

        // $('#window-main-table-container').html(containerHtml);

        // var footerHtml = paging.tryParseMenu('javascript:main.applications.home.getPaging({0});');

        // $('#window-main-table-footer').html(footerHtml);

        // main.applications.home.resize();
      }
    });

    masterpage.resize();
  }

  /**
   * 组件渲染事件  
   */
  render()
  {
    // x.debug.log('application.list.render');
    return (
      <MainContainer name="应用配置管理">
        <Grid key={this.state.data} columns={this.state.columns} data={this.state.data} ref="grid"></Grid>
      </MainContainer>
    );
  }
}

var styleBorder = { border: '1px solid #ff0' };

class ApplicationForm extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = { name: this.props.name };
    this.handleChange = this.handleChange.bind(this);
  }

  render()
  {
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

  handleChange(event)
  {
    this.setState({ name: event.target.value });
  }
}

export default {
  ApplicationComponent,
  ApplicationList,
  ApplicationOptionList,
  ApplicationMethodList
};