import settings from '../settings'

import React from 'react';
import ReactDOM from 'react-dom';

import Grid from '../../shared/layouts/Grid';
import Mask from '../../shared/layouts/Mask';
import MainContainer from '../../shared/layouts/MainContainer';

import ApplicationMenu from '../../shared/layouts/ApplicationMenu';
import ApplicationMenuHandleBar from '../../shared/layouts/ApplicationMenuHandleBar';

import { ApplicationOptionList } from './ApplicationOptionComponent';
import { ApplicationFeatureList } from './ApplicationFeatureComponent';
import { ApplicationSettingGroupList } from './ApplicationSettingGroupComponent';
import { ApplicationSettingList } from './ApplicationSettingComponent';
import { ApplicationMenuList, ApplicationMenuForm } from './ApplicationMenuComponent';
import { ApplicationMethodList } from './ApplicationMethodComponent';
import { ApplicationEventList } from './ApplicationEventComponent';

class ApplicationComponent extends React.Component {
  componentDidMount() {
    this.div = document.createElement('div');
    document.body.appendChild(this.div);
    // this.renderModel(this.props);
  }

  render() {
    x.debug.log('application.render');
    return (
      <div className="web-container" >
        <ApplicationMenu applicationId={settings.applications["ApplicationManagement"]} />
        <ApplicationMenuHandleBar />
        {this.props.children}
      </div>
    );
  }
}

class ApplicationList extends React.Component {
  /**
   * 构造函数
   */
  constructor(props) {
    super(props);

    // 分页对象
    this.paging = x.page.newPagingHelper(50);

    // 设置 TreeView 信息
    var treeViewRootTreeNodeId = '00000000-0000-0000-0000-000000000001';

    this.getTreeView(treeViewRootTreeNodeId);

    this.setTreeViewNode(treeViewRootTreeNodeId);

    // 设置 Button 信息
    this.buttons = [{ name: 'btnCreate', label: '新增', icon: '', handle: function () { console.log('button create'); } }];

    // 设置 State 信息
    this.state = {
      columns: [
        { reactKey: 0, "name": "应用代码", "width": "80px", "field": "code" },
        {
          reactKey: 1, "name": "应用名称(应用显示名称)", "field": "applicationName",
          render: function (node) {
            return <a href={"/applications/application/form?id=" + node.id } >{ node.applicationName }({ node.applicationDisplayName }) </a>;
          }
        },
        {
          reactKey: 2, "name": "状态", "width": "50px", "field": "status",
          render: function (node) {
            // console.log(node);

            switch (node.status) {
              case '-1':
              case '草稿':
                return <span key={node.name} style={{ color: "tomato" }} title="草稿" ><i className="fa fa-pencil-square"></i></span>;
              case '0':
              case '禁用':
                return <span key={node.name} className="red-text" title="禁用" ><i className="fa fa-times-circle"></i></span>;
              case '1':
              case '启用':
                return <span key={node.name} className="green-text" title="启用" ><i className="fa fa-check-circle"></i></span>;
              case '2':
              case '回收':
                return <span key={node.name} className="gray-text" title="回收" ><i className="fa fa-recycle"></i></span>;
              default:
                return node.status;
            }
          }
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
    // x.debug.log('application.list.render');
    return (
      <MainContainer name="应用配置管理" buttons={ this.buttons } tree={ this.tree } pagingData={this.paging} pagingHandle={(value) => { this.getPaging(value) } } ref="main" >
        <Grid key={this.state.data} columns={this.state.columns} data={this.state.data} ref="grid"></Grid>
      </MainContainer>
    );
  }

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

    x.net.xhr('/api/application.query.aspx', outString, {
      waitingType: 'mini',
      waitingMessage: i18n.strings.msg_net_waiting_query_tip_text,
      callback: function (response) {

        var result = x.toJSON(response);

        // 设置 reactKey 
        result.data.forEach(function (node) {
          node.reactKey = node.id;
        });

        this.paging.load(result.paging);

        this.refs.main.setState({ pagingData: this.paging });

        this.refs.grid.setState({ data: result.data });

      }.bind(this)
    });
  }
  /*#endregion*/

  /*#region 函数:getTreeView(value)*/
  /*
  * 获取树形菜单
  */
  getTreeView(value) {

    var treeViewId = '00000000-0000-0000-0000-000000000001';
    var treeViewName = '应用管理';
    var treeViewRootTreeNodeId = value; // 默认值:'00000000-0000-0000-0000-000000000001'
    var treeViewUrl = 'javascript:main.applications.application.option.list.setTreeViewNode(\'{treeNodeId}\')';

    var outString = '<?xml version="1.0" encoding="utf-8" ?>';

    outString += '<request>';
    outString += '<action><![CDATA[getDynamicTreeView]]></action>';
    outString += '<treeViewId><![CDATA[' + treeViewId + ']]></treeViewId>';
    outString += '<treeViewName><![CDATA[' + treeViewName + ']]></treeViewName>';
    outString += '<treeViewRootTreeNodeId><![CDATA[' + treeViewRootTreeNodeId + ']]></treeViewRootTreeNodeId>';
    outString += '<tree><![CDATA[{tree}]]></tree>';
    outString += '<parentId><![CDATA[{parentId}]]></parentId>';
    outString += '<url><![CDATA[' + treeViewUrl + ']]></url>';
    outString += '</request>';

    var tree = x.ui.pkg.tree.newTreeView({ name: 'main.applications.application.option.list.tree ' });

    tree.setAjaxMode(true);

    tree.add({
      id: "0",
      parentId: "-1",
      name: treeViewName,
      url: treeViewUrl.replace('{treeNodeId}', treeViewRootTreeNodeId),
      title: treeViewName,
      target: '',
      icon: '/resources/images/tree/tree_icon.gif'
    });

    tree.load('/api/application.getDynamicTreeView.aspx', false, outString);

    x.register('main.applications.application.option.list');

    window.main.applications.application.option.list.tree = this.tree = tree;
    window.main.applications.application.option.list.setTreeViewNode = this.setTreeViewNode.bind(this);
  }
  /*#endregion*/

  /*#region 函数:setTreeViewNode(value)*/
  setTreeViewNode(value) {
    this.paging.query.scence = 'QueryByParentId';
    this.paging.query.where.ParentId = value;
    this.paging.query.orders = ' OrderId ';

    this.getPaging(1);
  }
  /*#endregion*/
}

var styleBorder = { border: '1px solid #ff0' };

class ApplicationForm extends React.Component {
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

export default {
  ApplicationComponent,
  ApplicationList,
  ApplicationOptionList,
  ApplicationFeatureList,
  ApplicationSettingGroupList,
  ApplicationSettingList,
  ApplicationMenuList, 
  ApplicationMenuForm,
  ApplicationMethodList,
  ApplicationEventList
};