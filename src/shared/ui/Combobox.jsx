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

    this.state = { value: this.props.defaultValue, text: this.props.defaultText, data: [] };
  }

  /**
   * 组件加载完事件  
   */
  componentDidMount() {
    x.debug.log(this.name + '.componentDidMount');

    var width = ReactDOM.findDOMNode(this.refs.comboboxWrapper).style.width;

    if (width) {
      width = width.replace('px', '');
      ReactDOM.findDOMNode(this.refs.comboboxInnerContainer).style.width = (Number(width) + 39) + 'px';
    }

    if (this.props.xhrUrl) {
      this.xhrLoad();
    }
  }

  render() {
    var _this = this;
    return (
      <div id={"x-ui-" + this.id + "-wrapper"} className="input-group dropdown" style={this.props.style} ref="comboboxWrapper">
        <input id={"x-ui-" + this.id + "-view"} readOnly="readonly" name="x-ui-status-view" type="text" value={this.state.text} data-toggle="dropdown"
          onClick={this.handleClick.bind(this)} className="form-control" style={this.props.style} />
        <div id={"x-ui-" + this.id + "-combobox"} className="dropdown-menu" style={{ display: 'none' }} ref="combobox" >
          <div id={"x-ui-" + this.id + "-combobox-innerContainer"} style={{ display: 'none' }} className="x-ui-pkg-combobox" ref="comboboxInnerContainer" >
            <ul>
              {
                this.state.data.map(function (node) {
                  return (
                    <li key={node.value}><a href="javascript:void(0)" onClick={() => { _this.setValue(node.value, node.text); } }>{node.text}</a></li>
                  )
                })
              }
            </ul>
          </div>
        </div>
        <div className="input-group-addon"><span onClick={this.handleClick.bind(this)} className="glyphicon glyphicon-list"></span></div>
      </div>
    );
  }

  handleClick() {
    x.debug.log(this.name + '.click');

    ReactDOM.findDOMNode(this.refs.combobox).style.display = "";
    ReactDOM.findDOMNode(this.refs.comboboxInnerContainer).style.display = "";
  }

  setValue(value, text) {
    x.debug.log(value + ' - ' + text);

    this.value = value;
    this.text = text;

    this.setState({ value: value, text: text });
  }

  /**
   * 获取条件信息
   */
  xhrLoad() {
    var outString = '<?xml version="1.0" encoding="utf-8" ?>';

    outString += '<request>';
    outString += '<action><![CDATA[getCombobox]]></action>';
    outString += '<combobox><![CDATA[x-ui-status-combobox]]></combobox>';
    outString += '<selectedValue><![CDATA[1]]></selectedValue>';
    if (!x.isUndefined(this.props.emptyItemText) && this.props.emptyItemText.trim() !== '') {
      // 空白选项 全部 
      outString += '<emptyItemText><![CDATA[' + this.props.emptyItemText.trim() + ']]></emptyItemText>';
    }
    if (!x.isUndefined(this.props.xhrParams)) {
      x.each(this.props.xhrParams, function (key, value) {
        outString += '<' + key + '><![CDATA[' + value + ']]></' + key + '>';
      });
    }
    if (!x.isUndefined(this.props.xhrWhere)) {
      outString += '<whereClause><![CDATA[' + this.props.xhrWhere.replace('{0}', this.targetViewObject.val()).replace(/\\/g, '') + ']]></whereClause>';
    }
    outString += '<length>0</length>';
    outString += '</request>';

    x.net.xhr(this.props.xhrUrl, outString, {
      waitingType: 'mini',
      waitingMessage: i18n.strings.msg_net_waiting_query_tip_text,
      callback: function (response) {
        this.setState({ data: response.data });
      }.bind(this)
    });
  }
}

export default Combobox;