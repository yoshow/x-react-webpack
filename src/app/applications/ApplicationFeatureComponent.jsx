import i18n from '../i18n'
import settings from '../settings'

import React from 'react';
import ReactDOM from 'react-dom';

import Application from '../../shared/dom/Application';

import ApplicationWizard from '../../shared/wizards/ApplicationWizard';

import MainContainer from '../../shared/layouts/MainContainer';
import Grid from '../../shared/layouts/Grid';
import Mask from '../../shared/layouts/Mask';

import { Router, Route, IndexRoute, Link, hashHistory, applyRouterMiddleware } from 'react-router'

import { Modal, ModalManager } from '../../shared/layouts/Modal';
import * as Effect from '../../shared/layouts/Effect';

class ApplicationFeatureList extends React.Component {
  /**
   * 构造函数
   */
  constructor(props) {
    super(props);

    this.name = 'application.feature.list';

    x.debug.log(this.name + '.constructor');

    // 分页对象
    this.paging = x.page.newPagingHelper(50);

    // 设置 TreeView 信息
    var treeViewRootTreeNodeId = '00000000-0000-0000-0000-000000000001';

    this.getTreeView(treeViewRootTreeNodeId);

    this.setTreeViewNode(treeViewRootTreeNodeId);

    // 设置 Button 信息
    this.buttons = [{
      name: 'btnCreate', label: i18n.strings.btn_create, icon: 'glyphicon glyphicon-plus', handle: function () {
        x.debug.log(this.name + '.create');
        this.openDialog();
      }.bind(this)
    }];

    // 设置 过滤条件
    this.buttons = [{
      name: 'btnCreate', label: i18n.strings.btn_create, icon: 'glyphicon glyphicon-plus', handle: function () {
        x.debug.log(this.name + '.create');
        this.openDialog();
      }.bind(this)
    }];

    // 设置 State 信息
    this.state = {
      searchApplicationId: '00000000-0000-0000-0000-000000000001',
      searchApplicationName: '应用管理',
      columns: [
        {
          reactKey: 0, "name": "名称", "width": "160px", "field": "name",
          render: function (node) {
            return <a href="javascript:void(0)" onClick={() => { this.openDialog(node.name) } }>{node.name}</a>;
          }.bind(this)
        },
        { reactKey: 1, "name": "值", "field": "value" },
        {
          reactKey: 2, "name": "状态", "width": "60px", "field": "status",
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
    x.debug.log(this.name + '.render');
    return (
      <MainContainer name="应用功能设置" buttons={ this.buttons } renderFilters={ this.renderFilters.bind(this) } tree={ this.tree } pagingData={this.paging} pagingHandle={(value) => { this.getPaging(value) } } ref="main" >
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
        <label style={{ marginRight: "6px" }}>当前应用系统</label>
        <Application name="searchApplication2" value={this.state.searchApplicationId} text={this.state.searchApplicationName} onChange={(response) => { console.log(response); } } />
        <div className="input-group">
          <input id="searchApplicationName" name="searchApplicationName" type="text" value={this.state.searchApplicationName} className="form-control input-sm" />
          <input id="searchApplicationId" name="searchApplicationId" type="hidden" value={this.state.searchApplicationId} />
          <a id="btnApplicationWizard" role="button" className="input-group-addon" title="编辑" onClick={ () => { this.openApplicationWizard() } }><i className="glyphicon glyphicon-modal-window"></i></a>
        </div>
      </div>
    );
  }

  openApplicationWizard() {
    x.debug.log(this.name + '.openApplicationWizard');

    ModalManager.open(
      <ApplicationWizard name="applicationWizard" value={this.state.searchApplicationId} text={this.state.searchApplicationName} callback={(response) => {
        var resultView = '';
        var resultValue = '';

        var node = x.toJSON(response);

        resultView += node.text + ';';
        resultValue += node.value + ';';

        if (resultValue.substr(resultValue.length - 1, 1) == ';') {
          resultView = resultView.substr(0, resultView.length - 1)
          resultValue = resultValue.substr(0, resultValue.length - 1);
        }

        this.setState({ searchApplicationName: resultView, searchApplicationId: resultValue });

        // 回调后 重新加载树
        var treeViewRootTreeNodeId = resultValue;

        this.getTreeView(treeViewRootTreeNodeId);

        this.setTreeViewNode('[ApplicationId]' + treeViewRootTreeNodeId);
      } } />
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

    x.net.xhr('/api/application.feature.query.aspx', outString, {
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

  openDialog(value) {
    var name = x.isUndefined(value, '');

    x.debug.log(value);
    var url = '';

    x.debug.log(this.name + 'openDialog - ' + name);

    var outString = '<?xml version="1.0" encoding="utf-8" ?>';

    outString += '<request>';

    var isNewObject = false;

    if (name === '') {
      url = '/api/application.feature.create.aspx';

      isNewObject = true;
    }
    else {
      url = '/api/application.feature.findOne.aspx';

      outString += '<name><![CDATA[' + name + ']]></name>';
    }

    outString += '</request>';

    x.net.xhr(url, outString, {
      waitingType: 'mini',
      waitingMessage: i18n.strings.msg_net_waiting_query_tip_text,
      callback: function (response) {

        var result = x.toJSON(response);

        ModalManager.open(
          <Modal style={{ content: { width: "402px", background: "transparent" } }} onRequestClose = {() => true} effect = { Effect.SlideFromBottom } >
            <ApplicationFeatureForm name={"applicaiton-option-" + result.data.id} data={result.data} refreshParent={ () => { this.getPaging(this.paging.currentPage); } } />
          </Modal >
        );
      }.bind(this)
    });
  }

  /*#region 函数:getTreeView(value)*/
  /*
  * 获取树形菜单
  */
  getTreeView(value) {

    var treeViewId = '00000000-0000-0000-0000-000000000001';
    var treeViewName = '应用管理';
    var treeViewRootTreeNodeId = value; // 默认值:'00000000-0000-0000-0000-000000000001'
    var treeViewUrl = 'javascript:main.applications.application.feature.list.setTreeViewNode(\'{treeNodeId}\')';

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

    var tree = x.ui.pkg.tree.newTreeView({ name: 'main.applications.application.feature.list.tree ' });

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

    tree.load('/api/application.feature.getDynamicTreeView.aspx', false, outString);

    x.register('main.applications.application.feature.list');

    window.main.applications.application.feature.list.tree = this.tree = tree;
    window.main.applications.application.feature.list.setTreeViewNode = this.setTreeViewNode.bind(this);
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

class ApplicationFeatureForm extends React.Component {
  constructor(props) {
    super(props);
    // 设置组建名称
    this.name = 'application.feature.form';
    this.state = { data: this.props.data };
    // this.handleChange = this.handleChange.bind(this);
  }

  /**
   * 组件加载完事件  
   */
  componentDidMount() {
    x.debug.log(this.name + '.componentDidMount');
    // 将 data-x-* 替换为 x-* 标签

    var list = x.dom('*');

    x.each(list, function (index, node) {
      if (node.attributes) {
        for (var i = 0; i < node.attributes.length; i++) {
          if (node.attributes[i] && node.attributes[i].name.indexOf('data-x-') > -1) {
            node.setAttribute(node.attributes[i].name.replace('data-x-', 'x-'), node.attributes[i].value);
            node.removeAttribute(node.attributes[i].name);
            i--;
          }
        }
      }
    });
  }

  render() {
    return (
      <div key={this.props.name} id={this.props.name} className="winodw-wizard-wrapper" style={{ width: "400px", height: "auto" }}>
        <div className="winodw-wizard-toolbar">
          <div className="winodw-wizard-toolbar-close">
            <a href="javascript:void(0);" onClick={ModalManager.close} className="button-text"><i className="fa fa-close"></i></a>
          </div>
          <div className="float-left">
            <div className="winodw-wizard-toolbar-item" style={{ width: "200px" }}><span>应用选项信息</span></div>
            <div className="clear"></div>
          </div>
          <div className="clear"></div>
        </div>

        <div className="x-ui-pkg-tabs-wrapper">
          <div className="x-ui-pkg-tabs-toolbar">
            <button id="btnClose" type="button" onClick={ ModalManager.close }  className="btnClose" title="关闭">关闭</button>
            <button id="btnSave" type="button" onClick={ this.handleClick.bind(this) } className="btnSave" title="保存">保存</button>
            <div className="clear"></div>
          </div>
          <div className="x-ui-pkg-tabs-container" style={{ margin: "10px 0 20px 0" }}>
            <div id="window-condition-container">
              <div>
                <table className="table table-borderless">
                  <tbody>
                    <tr className="table-row-normal-transparent">
                      <td className="table-body-text" style={{ width: "120px" }}>所属应用</td>
                      <td className="table-body-input">
                        <input id="id" name="id" type="hidden" value={this.state.data.id} data-x-dom-data-type="value" />
                        <input id="applicationId" name="name" type="text" defaultValue={this.state.data.applicationId} data-x-dom-data-type="value" className="form-control" style={{ width: "200px" }} />
                      </td>
                    </tr>
                    <tr className="table-row-normal-transparent">
                      <td className="table-body-text" style={{ width: "120px" }}>名称</td>
                      <td className="table-body-input">
                        <input id="name" name="name" type="text" defaultValue={this.state.data.name} data-x-dom-data-type="value" className="form-control" style={{ width: "200px" }} />
                      </td>
                    </tr>
                    <tr className="table-row-normal-transparent">
                      <td className="table-body-text">值</td>
                      <td className="table-body-input">
                        <input id="name" name="name" type="text" defaultValue={this.state.data.value} data-x-dom-data-type="value" className="form-control" style={{ width: "200px" }} />
                      </td>
                    </tr>
                    <tr className="table-row-normal-transparent">
                      <td className="table-body-text">排序</td>
                      <td className="table-body-input">
                        <input id="orderId" name="orderId" type="text" defaultValue={this.state.data.orderId}
                          data-x-dom-data-type="value" className="form-control" style={{ width: "200px" }} />
                      </td>
                    </tr>
                    <tr className="table-row-normal-transparent">
                      <td className="table-body-text">备注</td>
                      <td className="table-body-input">
                        <textarea id="remark" name="remark" defaultValue={this.state.data.remark}
                          data-x-dom-data-type="value" className="form-control" style={{ width: "200px", height: "80px" }} ></textarea>
                      </td>
                    </tr>
                    <tr className="table-row-normal-transparent">
                      <td className="table-body-text">启用</td>
                      <td className="table-body-input">
                        <input id="status" name="status" type="checkbox" defaultValue={this.state.data.status}
                          data-x-dom-data-type="value" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*#region 函数:checkObject()*/
  /*
  * 检测对象的必填数据
  */
  checkObject() {
    if (x.dom.data.check()) {
      return false;
    }

    return true;
  }
  /*#endregion*/

  /*#region 函数:save()*/
  save() {
    if (this.checkObject()) {
      var outString = '<?xml version="1.0" encoding="utf-8" ?>';

      outString += '<request>';
      outString += x.dom.data.serialize({ storageType: 'xml', scope: '#' + this.props.name });
      outString += '</request>';

      x.net.xhr('/api/application.feature.save.aspx', outString, {
        waitingMessage: i18n.strings.msg_net_waiting_save_tip_text,
        callback: function (response) {

          this.props.refreshParent();

          ModalManager.close()

        }.bind(this)
      });
    }
  }
  /*#endregion*/

  handleClick(event) {
    x.debug.log(this.name + '.handleClick');

    this.save();
  }
}

export { ApplicationFeatureList };