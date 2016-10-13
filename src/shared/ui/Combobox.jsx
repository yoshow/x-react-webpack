import stylesheet from './Tabs.less';

import React from 'react';
import ReactDOM from 'react-dom';

class Combobox extends React.Component {
  constructor(props) {
    super(props);

    this.name = "combobox";

    this.id = this.props.id;
    this.width = this.props.width;

    // 回调事件
    this.callback = this.props.callback;

    this.xhrUrl = this.props.xhrUrl;
    this.xhrParams = this.props.xhrParams;

    this.state = {
    };
  }

  /**
   * 组件加载完事件  
   */
  componentDidMount() {
    x.debug.log(this.name + '.componentDidMount');
  }

  render() {
    return (
      <div id={"x-ui-" + this.id + "-wrapper"} className="input-group dropdown" style={{ width: '136px' }} >
        <input id={"x-ui-status1-view"} readOnly="readonly" name="x-ui-status-view" type="text" value="已建模" data-toggle="dropdown"
          onClick={this.handleClick.bind(this)} className="form-control" style={{ width: '162px' }} />
        <div ref="combobox" id={"x-ui-status1-combobox"} className="dropdown-menu" style={{ width: '166px', display: 'none' }}>
          <div ref="comboboxInnerContainer" id={"x-ui-status1-combobox-innerContainer"} style={{ display: 'none' }} className="x-ui-pkg-combobox">正在加载数据...</div>
        </div>
        <div className="input-group-addon"><span className="glyphicon glyphicon-list"></span></div>
      </div>
    );
  }

  handleClick() {
    x.debug.log(this.name + '.click');

    ReactDOM.findDOMNode(this.refs.combobox).style.display = "";
    ReactDOM.findDOMNode(this.refs.comboboxInnerContainer).style.display = "";
  }
  
  /**
   * 获取条件信息
   */
  findAll(bankId) {
    var outString = '<request><query><scence><![CDATA[QueryByBankId]]></scence><where><key name="BankId" ><![CDATA[' + bankId + ']]></key></where><orders><![CDATA[orderId,name]]></orders></query></request>';

    x.net.xhr('/api/bigdb.condition.findAll.aspx', outString, {
      waitingType: 'mini',
      waitingMessage: i18n.strings.msg_net_waiting_query_tip_text,
      callback: function (response) {
        // var list = response.data;
        this.setState({ data: response.data });
      }.bind(this)
    });
  }
}

export default Combobox;