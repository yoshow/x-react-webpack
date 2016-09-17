import i18n from '../i18n'
import settings from '../settings'

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory, applyRouterMiddleware } from 'react-router'

import MainContainer from '../../shared/layouts/MainContainer';
import Grid from '../../shared/layouts/Grid';
import Mask from '../../shared/layouts/Mask';

class ApplicationMenuList extends React.Component {
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
    this.buttons = [{ name: 'btnCreate-2', label: '新增', icon: '', handle: function () { console.log('button create'); } }];

    // 设置 State 信息
    this.state = {

      // 配置数据列
      columns: [
        { reactKey: 0, "name": "方法代码", "width": "160px", "field": "code" },
        {
          reactKey: 1, "name": "名称", "field": "name",
          render: function (node) {
            return <Link to={"/applications/application-menu/form/" + node.id } >{node.name}</Link>;
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

    x.net.xhr('/api/application.menu.query.aspx', outString, {
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

  /**
   * 组件渲染事件    
   */
  render() {
    x.debug.log('application.menu.list.render');
    return (
      <MainContainer name="应用菜单管理" buttons={ this.buttons } renderFilters={this.renderFilters} tree={ this.tree } pagingData={this.paging} pagingHandle={(value) => { this.getPaging(value) } } ref="main" >
        <Grid key={this.state.data} columns={this.state.columns} data={this.state.data} ref="grid"></Grid>
      </MainContainer>
    );
  }

  /**
   * 生成过滤条件界面    
   */
  renderFilters() {
    x.debug.log(this.name + '.renderFilters');
    return (
      <div className="table-row-filter form-inline text-right x-freeze-height">
        <input id="searchText" type="text" defaultValue="" className="form-control input-sm" style={{ marginRight: "4px" }}/>
        <button id="btnFilter" className="btn btn-default btn-sm" title={i18n.strings.btn_query}><i className="glyphicon glyphicon-search"></i></button>
      </div>);
  }

  /*#region 函数:confirmDelete(id)*/
  /*
  * 删除对象
  */
  confirmDelete(id) {
    x.debug.log('application.menu.list.confirmDelete - ' + id);
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
    var treeViewUrl = 'javascript:main.applications.application.menu.list.setTreeViewNode(\'{treeNodeId}\')';

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

    var tree = x.ui.pkg.tree.newTreeView({ name: 'main.applications.application.menu.list.tree' });

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

    x.register('main.applications.application.menu.list');

    window.main.applications.application.menu.list.tree = this.tree = tree;
    window.main.applications.application.menu.list.setTreeViewNode = this.setTreeViewNode.bind(this);
  }
  /*#endregion*/

  /*#region 函数:setTreeViewNode(value)*/
  setTreeViewNode(value) {
    this.paging.query.where.ApplicationId = value;
    this.paging.query.orders = ' Name ';

    this.getPaging(1);
  }
  /*#endregion*/
}

class ApplicationMenuForm extends React.Component {
  constructor(props) {
    super(props); 
  
    this.name = 'application.method.list';
    this.state = { name: this.props.name };
    this.handleChange = this.handleChange.bind(this);
  
    console.log(this.name +'constructor');
  }

  render() {
    console.log(this.name +'render');
    return (
      <div>
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

export { ApplicationMenuList, ApplicationMenuForm };
