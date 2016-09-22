import React from 'react';
import ReactDOM from 'react-dom';

import MainContainer from '../../shared/layouts/MainContainer';
import Grid from '../../shared/ui/Grid';
import Mask from '../../shared/ui/Mask';

import { Router, Route, IndexRoute, Link, hashHistory, applyRouterMiddleware } from 'react-router'

import { Modal, ModalManager } from '../../shared/layouts/Modal';
import * as Effect from '../../shared/ui/Animations';

class RoleList extends React.Component {
  /**
   * 构造函数
   */
  constructor(props) {
    super(props);

    x.debug.log('membership.role.list.constructor');

    // 分页对象
    this.paging = x.page.newPagingHelper(50);

    // 设置 TreeView 信息
    var treeViewRootTreeNodeId = '00000000-0000-0000-0000-000000000001';

    this.getTreeView(treeViewRootTreeNodeId);

    this.setTreeViewNode(treeViewRootTreeNodeId);

    // 设置 Button 信息
    this.buttons = [{
      name: 'btnCreate', label: '新增', icon: '', handle: function () {
        x.debug.log('button create');
        this.openDialog();
      }.bind(this)
    }];

    // 设置 State 信息
    this.state = {
      columns: [
        {
          reactKey: 0, "name": "名称", "width": "160px", "field": "name",
          render: function (node) {
            // return <Link to={'/membership/computer/form/' + node.id}>{node.name}</Link>;
            return <a href="javascript:void(0)" onClick={() => { this.openDialog(node.id) } }>{node.name}</a>;
          }.bind(this)
        },
        {
          reactKey: 1, "name": "全局名称", "field": "globalName"
        },
        {
          reactKey: 3, "name": "修改日期", "width": "100px", "field": "modifiedDate",
          render: function (node) { return x.date.newTime(node.modifiedDate).toString('yyyy-MM-dd'); }
        },
        {
          reactKey: 4, "name": "删除", "width": "30px", icon: "fa fa-trash", action: true,
          handle: function (node) {
            // 删除事件
            if (confirm(i18n.strings.msg_are_you_sure_you_want_to_delete)) {
              x.net.xhr('/api/membership.role.delete.aspx?id=' + node.id, {
                callback: function (response) {
                  this.getPaging(this.paging.currentPage);
                }.bind(this)
              });
            }
          }.bind(this)
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
    x.debug.log('membership.role.list.render');
    return (
      <MainContainer name="角色管理" buttons={ this.buttons } tree={ this.tree } pagingData={this.paging} pagingHandle={(value) => { this.getPaging(value) } } ref="main" >
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

    x.net.xhr('/api/membership.role.query.aspx', outString, {
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
  /*#endregion*/

  openDialog(value) {
    var id = x.isUndefined(value, '');

    var url = '';

    x.debug.log('openDialog - ' + id);

    var outString = '<?xml version="1.0" encoding="utf-8" ?>';

    outString += '<request>';

    var isNewObject = false;

    if (id === '') {
      url = '/api/membership.role.create.aspx';

      isNewObject = true;
    }
    else {
      url = '/api/membership.role.findOne.aspx';

      outString += '<id><![CDATA[' + id + ']]></id>';
    }

    outString += '</request>';

    x.net.xhr(url, outString, {
      waitingType: 'mini',
      waitingMessage: i18n.strings.msg_net_waiting_query_tip_text,
      callback: function (response) {

        var result = x.toJSON(response);

        ModalManager.open(
          <Modal style={{ content: { width: "602px", background: "transparent" } }} onRequestClose = {() => true} effect = { Effect.SlideFromBottom } >
            <RoleForm name={"computer-" + result.data.id} data={result.data} refreshParent={ () => { this.getPaging(this.paging.currentPage); } } />
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
    var treeViewName = '组织结构';
    var treeViewRootTreeNodeId = value; // 默认值:'00000000-0000-0000-0000-000000000001'
    var treeViewUrl = 'javascript:main.membership.role.list.setTreeViewNode(\'{treeNodeId}\')';

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

    var tree = x.ui.pkg.tree.newTreeView({ name: 'main.membership.role.list.tree ' });

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

    tree.load('/api/membership.contacts.getDynamicTreeView.aspx', false, outString);

    x.register('main.membership.role.list');

    window.main.membership.role.list.tree = this.tree = tree;
    window.main.membership.role.list.setTreeViewNode = this.setTreeViewNode.bind(this);
  }
  /*#endregion*/

  /*#region 函数:setTreeViewNode(value)*/
  setTreeViewNode(value) {
    this.paging.query.scence = 'QueryByOrganizationUnitId';
    this.paging.query.where.OrganizationUnitId = value;
    this.paging.query.orders = ' OrderId ';

    this.getPaging(1);
  }
  /*#endregion*/
}

class RoleForm extends React.Component {
  constructor(props) {
    super(props);
    // 设置组建名称
    this.name = 'membership.role.form';
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
      <div key={this.props.name} id={this.props.name} className="winodw-wizard-wrapper" style={{ width: "600px", height: "auto" }}>
        <div className="winodw-wizard-toolbar">
          <div className="winodw-wizard-toolbar-close">
            <a href="javascript:void(0);" onClick={ModalManager.close} className="button-text"><i className="fa fa-close"></i></a>
          </div>
          <div className="float-left">
            <div className="winodw-wizard-toolbar-item" style={{ width: "200px" }}><span>角色信息</span></div>
            <div className="clear"></div>
          </div>
          <div className="clear"></div>
        </div>

        <div className="x-ui-pkg-tabs-wrapper">

          <div className="x-ui-pkg-tabs-menu-wrapper" >
            <ul className="x-ui-pkg-tabs-menu nav nav-tabs" >
              <li><a href="#tab-1">基本信息</a></li>
              <li><a href="#tab-2">所属角色</a></li>
              <li><a href="#tab-3">备注</a></li>
            </ul>
          </div>

          <div className="x-ui-pkg-tabs-container" >
            <h2 className="x-ui-pkg-tabs-container-head-hidden"><a id="tab-1" name="tab-1" >基本信息</a></h2>
            <table className="table">
              <tbody>
                <tr className="table-row-normal-transparent" style={{ display: ((this.state.data.id === '00000000-0000-0000-0000-000000000001') ? 'none;' : '') }} >
                  <td className="table-body-text" style={{ width: "120px" }} ><span className="required-text">上级组织</span></td>
                  <td className="table-body-input" colSpan="3" >
                    <input id="parentId" name="parentId" type="hidden" data-x-dom-data-type="value" value={this.state.data.parentId } />
                    <input id="parentName" name="parentName" type="text" data-x-dom-data-type="value" value={this.state.data.parentGlobalName } className="form-control" style={{ width: "120px;" }} />
                    <a onClick={this.setParentNodeWizard(this.state.data.parentId) } >编辑</a>
                  </td>
                </tr>

                <tr className="table-row-normal-transparent" >
                  <td className="table-body-text" style={{ width: "120px" }} >编号</td>
                  <td className="table-body-input" style={{ width: "160px" }} >
                    <input id="id" name="id" type="hidden" data-x-dom-data-type="value" defaultValue={this.state.data.id} />
                    <input id="level" name="level" type="hidden" data-x-dom-data-type="value" defaultValue={this.state.data.level} />
                    <input id="fullPath" name="fullPath" type="hidden" data-x-dom-data-type="value" defaultValue={this.state.data.fullPath} />
                    <input id="distinguishedName" name="distinguishedName" type="hidden" data-x-dom-data-type="value" defaultValue={this.state.data.distinguishedName} />
                    {
                      (() => {
                        if (typeof (this.state.data.code) === 'undefined' || this.state.data.code === '') {
                          return (
                            <div>
                              <span className="gray-text">自动编号</span>
                              <input id="code" name="code" type="hidden" data-data-x-dom-data-type="value" />
                            </div>
                          )
                        }
                        else {
                          return <input id="code" name="code" type="text" data-x-dom-data-type="value" defaultValue={this.state.data.code} className="form-control" style={{ width: "120px;" }} />
                        }
                      })()
                    }
                  </td>
                  <td className="table-body-text" style={{ width: "120px" }} >全称</td>
                  <td className="table-body-input" >
                    <input id="fullName" name="fullName" type="text" data-x-dom-data-type="value" defaultValue={this.state.data.fullName} className="form-control" style={{ width: "120px;" }} />
                  </td>
                </tr>

                <tr className="table-row-normal-transparent" >
                  <td className="table-body-text" style={{ width: "120px" }} ><span className="required-text">名称</span></td>
                  <td className="table-body-input" >
                    <input id="originalName" name="originalName" type="hidden" data-x-dom-data-type="value" value={this.state.data.name} />
                    <input id="name" name="name" type="text" data-x-dom-data-type="value" data-x-dom-data-required="1" data-x-dom-data-required-warning="【名称】必须填写。" defaultValue={this.state.data.name} className="form-control" style={{ width: "120px;" }} />
                  </td>
                  <td className="table-body-text" style={{ width: "120px" }} >所属标准组织</td>
                  <td className="table-body-input" >
                    <input id="standardOrganizationUnitId" name="standardOrganizationUnitId" type="hidden" data-x-dom-data-type="value"
                      defaultValue={this.state.data.standardOrganizationUnitId} selectedText={this.state.data.standardOrganizationName}
                      data-x-dom-feature="contacts" data-x-dom-contactTypeText="standard-organization" className="form-control" style={{ width: "120px" }} />
                  </td>
                </tr>

                <tr className="table-row-normal-transparent">
                  <td className="table-body-text" ><span className="required-text">全局名称</span></td>
                  <td className="table-body-input">
                    <input id="originalGlobalName" name="originalGlobalName" type="hidden" data-x-dom-data-type="value" defaultValue={this.state.data.globalName} />
                    <input id="globalName" name="globalName" type="text" data-x-dom-data-type="value" defaultValue={this.state.data.globalName} data-x-dom-data-required="1" data-x-dom-data-required-warning="【全局名称】必须填写。" className="form-control" style={{ width: "120px" }} />
                  </td>
                  <td className="table-body-text" >拼音</td>
                  <td className="table-body-input">
                    <input id="pinyin" name="pinyin" type="text" data-x-dom-data-type="value" defaultValue={this.state.data.pinyin} className="form-control" style={{ width: "120px" }} />
                  </td>
                </tr>

                <tr className="table-row-normal-transparent">
                  <td className="table-body-text" ><span className="required-text">组织类型</span></td>
                  <td className="table-body-input">
                    <input id="type" name="type" type="text" data-x-dom-data-type="value" defaultValue={this.state.data.type} data-x-dom-feature="combobox" selectedText={this.state.data.typeView} url="/api/application.setting.getCombobox.aspx" comboboxWhereClause=" ApplicationSettingGroupId IN ( SELECT Id FROM tb_Application_SettingGroup WHERE Name = ##应用管理_协同平台_人员及权限管理_组织管理_组织类别## ) " className="form-control" style={{ width: "120px" }} />
                  </td>
                  <td className="table-body-text" style={{ width: "120px" }} >作用范围</td>
                  <td className="table-body-input">
                    <input id="effectScope" name="effectScope" type="text" data-x-dom-data-type="value" defaultValue={this.state.data.effectScope} data-x-dom-feature="combobox" selectedText={this.state.data.effectScopeView} data-x-dom-url="/api/application.setting.getCombobox.aspx" comboboxWhereClause=" ApplicationSettingGroupId IN ( SELECT Id FROM tb_Application_SettingGroup WHERE Name = ##应用管理_协同平台_人员及权限管理_权限作用范围## ) " className="form-control" style={{ width: "120px" }} />
                  </td>
                </tr>

                <tr className="table-row-normal-transparent">
                  <td className="table-body-text" >排序标识</td>
                  <td className="table-body-input">
                    <input id="orderId" name="orderId" type="text" data-x-dom-data-type="value" defaultValue={this.state.data.orderId} style={{ width: "120px" }} />
                  </td>
                  <td className="table-body-text" >启用企业邮箱</td>
                  <td className="table-body-input" >
                    <input id="enableExchangeEmail" name="enableExchangeEmail" type="checkbox" data-x-dom-data-type="value" data-x-dom-feature="checkbox" defaultValue={this.state.data.enableExchangeEmail} />
                  </td>
                </tr>

                <tr className="table-row-normal-transparent">
                  <td className="table-body-text" >启用</td>
                  <td className="table-body-input" >
                    <input id="status" name="status" type="checkbox" data-x-dom-data-type="value" data-x-dom-feature="checkbox" defaultValue={this.state.data.status} />
                  </td>
                  <td className="table-body-text" >防止意外删除</td>
                  <td className="table-body-input" >
                    <input id="lock" name="lock" type="checkbox" data-x-dom-data-type="value" data-x-dom-feature="checkbox" defaultValue={ this.state.data.lock} />
                  </td>
                </tr>

                <tr className="table-row-normal-transparent">
                  <td className="table-body-text" >更新时间</td>
                  <td className="table-body-input" > {x.date.newTime(this.state.data.modifiedDate).toString('yyyy-MM-dd HH:mm:ss') }
                    <input id="modifiedDate" name="modifiedDate" type="hidden" data-x-dom-data-type="value" defaultValue={this.state.data.modifiedDateTimestampView} />
                  </td>
                  <td className="table-body-text" >创建时间</td>
                  <td className="table-body-input" > {x.date.newTime(this.state.data.createDate).toString('yyyy-MM-dd HH:mm:ss') }
                    <input id="createDate" name="createDate" type="hidden" data-x-dom-data-type="value" defaultValue={this.state.data.createDateTimestampView} />
                  </td>
                </tr>
              </tbody>     </table>
          </div>

          <div className="x-ui-pkg-tabs-container" >
            <h2 className="x-ui-pkg-tabs-container-head-hidden"><a name="tab-2" id="tab-2">角色</a></h2>

            <table className="table" ><tbody>
              <tr className="table-row-normal-transparent">
                <td className="table-body-text" style={{ width: "120px" }} >角色</td>
                <td className="table-body-input">
                  <textarea id="roleText" name="roleText" data-x-dom-data-type="value" className="textarea-normal" style={{ width: "460px", height: "80px" }} >{this.state.data.roleView }</textarea>
                </td>
              </tr>

              <tr className="table-row-normal-transparent">
                <td className="table-body-text" style={{ width: "120px" }} >成员</td>
                <td className="table-body-input">
                  <textarea id="roleMemberView" name="roleMemberView" defaultValue={ this.state.data.roleMemberView}  className="textarea-normal" style={{ width: "460px", height: "80px" }} ></textarea>
                </td>
              </tr></tbody>
            </table>
          </div>

          <div className="x-ui-pkg-tabs-container" >
            <h2 className="x-ui-pkg-tabs-container-head-hidden"><a name="tab-3" id="tab-3">备注</a></h2>

            <table className="table">
              <tbody>
                <tr className="table-row-normal-transparent" >
                  <td className="table-body-text" style={{ width: "120px" }} >备注</td>
                  <td className="table-body-input">
                    <textarea id="remark" name="remark" type="text" defaultValue={ this.state.data.remark} data-x-dom-data-type="value" className="textarea-normal x-ajax-textarea" style={{ width: "460px", height: "80px" }} ></textarea>
                  </td>
                </tr></tbody>
            </table>
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

      x.net.xhr('/api/membership.role.save.aspx', outString, {
        waitingMessage: i18n.strings.msg_net_waiting_save_tip_text,
        callback: function (response) {
          // var result = x.toJSON(response).message;

          // 如果有父级窗口，则调用父级窗口默认刷新函数。
          this.props.refreshParent();
          // main.getPaging(main.paging.currentPage);

          // x.msg(result.value);

          // main.mask.close();
          // x.page.close();
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

  setParentNodeWizard(id) {
    x.debug.log(this.name + '.setParentNodeWizard ' + id);
  }
}

export { RoleList, RoleForm };