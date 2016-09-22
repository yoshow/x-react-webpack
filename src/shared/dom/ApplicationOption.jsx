import React from 'react';
import ReactDOM from 'react-dom';

import MainContainer from '../../shared/layouts/MainContainer';
import Mask from '../../shared/ui/Mask';

import { Router, Route, IndexRoute, Link, hashHistory, applyRouterMiddleware } from 'react-router'

import { Modal, ModalManager } from '../../shared/layouts/Modal';
import * as Effect from '../../shared/ui/Animations';

class ApplicationWizard extends React.Component {
  /**
   * 构造函数
   */
  constructor(props) {
    super(props);

    this.name = props.name;
    this.callback = props.callback;
    this.state = { value: props.value, text: props.text }

    // 设置 TreeView 信息
    var treeViewRootTreeNodeId = '00000000-0000-0000-0000-000000000001';

    this.tree = null;

    this.getTreeView(treeViewRootTreeNodeId);

    this.setTreeViewNode(treeViewRootTreeNodeId);

    x.debug.log(this.name + '.constructor');
  }

  /**
   * 组件渲染事件  
   */
  render() {
    x.debug.log(this.name + '.render');
    return (
      <Modal style={{ content: { width: "302px" } }} onRequestClose = {() => true} effect = { Effect.SlideFromBottom } >
        <div id={this.name} className="winodw-wizard-wrapper" style={{ width: "300px", height: "auto" }} >
          <div className="winodw-wizard-toolbar" >
            <div className="winodw-wizard-toolbar-close">
              <a role="button" onClick={ModalManager.close} title="关闭" ><i className="fa fa-close"></i></a>
            </div>
            <div className="float-left">
              <div className="winodw-wizard-toolbar-item" style={{ width: "200px" }} ><span>应用选择向导</span></div>
              <div className="clear"></div>
            </div>
            <div className="clear"></div>
          </div>

          <div id={this.name + "-wizardTreeViewContainer"} dangerouslySetInnerHTML={ this.createMarkup() } className="winodw-wizard-tree-view" style={{ width: "296px", height: "300px" }} ></div>

          <div className="winodw-wizard-result-container form-inline text-right" >
            <label className="winodw-wizard-result-item-text" style={{ marginRight: "6px" }}>应用名称</label>
            <input ref="wizardText" id={this.name + "-wizardApplicationText"} name={this.name + "-wizardApplicationText"} type="text"
              defaultValue={this.props.text} className="winodw-wizard-result-item-input form-control input-sm" style={{ width: "160px", marginRight: "6px" }} />
            <input ref="wizardId" id={this.name + "-wizardApplicationValue"} name={this.name + "-wizardApplicationValue"} type="hidden"
              defaultValue={this.props.value} />
            <a role="button" onClick={ this.handleClick.bind(this) } className="btn btn-default btn-sm" >确定</a>
          </div>
        </div>
      </Modal>
    );
  }

  createMarkup() {
    return { __html: this.tree.toString() };
  };

  handleClick(event) {
    ModalManager.close();
    this.callback(this.returnValue);
  }

  /*#region 函数:getTreeView(value)*/
  /*
  * 获取树形菜单
  */
  getTreeView(value) {

    var treeViewId = '00000000-0000-0000-0000-000000000001';
    var treeViewName = '应用管理';
    var treeViewRootTreeNodeId = value; // 默认值:'00000000-0000-0000-0000-000000000001'
    var treeViewUrl = 'javascript:wizards[\'application.wizard\'].setTreeViewNode(\'{treeNodeId}\',\'{treeNodeName}\')';

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

    var tree = x.ui.pkg.tree.newTreeView({ name: 'application.wizard' });

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

    this.tree = tree;

    x.register('wizards');

    window.wizards['application.wizard'] = {
      tree: this.tree,
      setTreeViewNode: this.setTreeViewNode.bind(this)
    };

    //  window.wizards['application.wizard'].tree = this.tree = tree;
    //  window.wizards['application.wizard'].setTreeViewNode = this.setTreeViewNode.bind(this);
  }
  /*#endregion*/

  /*#region 函数:setTreeViewNode(value)*/
  setTreeViewNode(value, text) {
    x.debug.log('{"text":"' + text + '","value":"' + value + '"}');
    $(document.getElementById(this.name + '-wizardApplicationText')).val(text);
    $(document.getElementById(this.name + '-wizardApplicationValue')).val(value);
    this.returnValue = '{"text":"' + text + '","value":"' + value + '"}';
  }
  /*#endregion*/
}

export default ApplicationWizard;