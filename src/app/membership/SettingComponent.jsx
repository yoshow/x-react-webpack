import React from 'react';
import ReactDOM from 'react-dom';

import MainContainer from '../../shared/layouts/MainContainer';
import Grid from '../../shared/ui/Grid';
import Mask from '../../shared/ui/Mask';

import { Router, Route, IndexRoute, Link, hashHistory, applyRouterMiddleware } from 'react-router'

import { Modal, ModalManager } from '../../shared/layouts/Modal';
import * as Effect from '../../shared/ui/Animations';

class SettingList extends React.Component {
  /**
   * 构造函数
   */
  constructor(props) {
    super(props);

    x.debug.log('membership.setting.list.constructor');

    // 分页对象
    this.paging = x.page.newPagingHelper(50);

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
          reactKey: 1, "name": "IP(MAC)", "field": "ip",
          render: function (node) { return node.ip + '(' + node.mac + ')'; }
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
              x.net.xhr('/api/membership.setting.delete.aspx?id=' + node.id, {
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
    x.debug.log('membership.setting.list.render');
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

    x.net.xhr('/api/membership.setting.query.aspx', outString, {
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

  openDialog(value) {
    var id = x.isUndefined(value, '');

    var url = '';

    x.debug.log('openDialog - ' + id);

    var outString = '<?xml version="1.0" encoding="utf-8" ?>';

    outString += '<request>';

    var isNewObject = false;

    if (id === '') {
      url = '/api/membership.setting.create.aspx';

      isNewObject = true;
    }
    else {
      url = '/api/membership.setting.findOne.aspx';

      outString += '<id><![CDATA[' + id + ']]></id>';
    }

    outString += '</request>';

    x.net.xhr(url, outString, {
      waitingType: 'mini',
      waitingMessage: i18n.strings.msg_net_waiting_query_tip_text,
      callback: function (response) {

        var result = x.toJSON(response);

        ModalManager.open(
          <Modal style={{ content: { width: "402px", background: "transparent" } }} onRequestClose = {() => true} effect = { Effect.SlideFromBottom } >
            <SettingForm name={"computer-" + result.data.id} data={result.data} refreshParent={ () => { this.getPaging(this.paging.currentPage); } } />
          </Modal >
        );
      }.bind(this)
    });
  }
}

class SettingForm extends React.Component {
  constructor(props) {
    super(props);
    // 设置组建名称
    this.name = 'membership.setting.form';
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
            <div className="winodw-wizard-toolbar-item" style={{ width: "200px" }}><span>计算机信息</span></div>
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
                      <td className="table-body-text" style={{ width: "120px" }}>名称</td>
                      <td className="table-body-input">
                        <input id="id" name="id" type="hidden" value={this.state.data.id} data-x-dom-data-type="value" />
                        <input id="name" name="name" type="text" defaultValue={this.state.data.name} data-x-dom-data-type="value" className="form-control" style={{ width: "200px" }} />
                      </td>
                    </tr>
                    <tr className="table-row-normal-transparent">
                      <td className="table-body-text">计算机类型</td>
                      <td className="table-body-input">
                        <input id="type" name="type" type="text" defaultValue={this.state.data.type} data-x-dom-data-type="value" className="form-control" style={{ width: "200px" }} />
                      </td>
                    </tr>
                    <tr className="table-row-normal-transparent">
                      <td className="table-body-text">IP</td>
                      <td className="table-body-input">
                        <input id="ip" name="ip" type="text" defaultValue={this.state.data.ip} data-x-dom-data-type="value" className="form-control" style={{ width: "200px" }} />
                      </td>
                    </tr>
                    <tr className="table-row-normal-transparent">
                      <td className="table-body-text">MAC</td>
                      <td className="table-body-input">
                        <input id="mac" name="mac" type="text" defaultValue={this.state.data.mac} data-x-dom-data-type="value" className="form-control" style={{ width: "200px" }} />
                      </td>
                    </tr>
                    <tr className="table-row-normal-transparent">
                      <td className="table-body-text">备注</td>
                      <td className="table-body-input">
                        <textarea id="remark" name="remark" data-x-dom-data-type="value" className="form-control" style={{ width: "200px", height: "80px" }} >{this.state.data.remark}</textarea>
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

      x.net.xhr('/api/membership.setting.save.aspx', outString, {
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
}

export { SettingList, SettingForm };