import React from 'react';
import ReactDOM from 'react-dom';

import Mask from '../../shared/layouts/Mask';

import { Router, Route, IndexRoute, Link, hashHistory, applyRouterMiddleware } from 'react-router'

import { Modal, ModalManager } from '../../shared/layouts/Modal';
import * as Effect from '../../shared/layouts/Effect';

import ApplicationWizard from '../../shared/wizards/ApplicationWizard';

class Application extends React.Component {
  /**
   * 构造函数
   */
  constructor(props) {
    super(props);

    this.name = props.name;
    this.onChange = props.onChange;

    this.state = { value: props.value, text: props.text }

    x.debug.log(this.name + '.constructor');
  }

  /**
   * 组件渲染事件  
   */
  render() {
    x.debug.log(this.name + '.render');
    return (
      <div className="input-group">
        <input id={this.name + "-text"} type="text" value={ this.state.text } className="form-control input-sm" />
        <input id={this.name + "-value"} type="hidden" value={ this.state.value } />
        <a id={this.name + "-btnEdit"} role="button" className="input-group-addon" title="编辑" onClick={ this.open.bind(this) }><i className="glyphicon glyphicon-modal-window"></i></a>
      </div>
    );
  }

  open() {
    x.debug.log(this.name + '.open');

    ModalManager.open(
      <ApplicationWizard name="applicationWizard" value={ this.state.value } text={ this.state.text }
        onClose={ this.handleClose.bind(this) } />
    );
  }

  handleClose(response) {
    x.debug.log(this.name + '.callback');
    var resultView = '';
    var resultValue = '';

    var node = x.toJSON(response);

    resultView += node.text + ';';
    resultValue += node.value + ';';

    if (resultValue.substr(resultValue.length - 1, 1) == ';') {
      resultView = resultView.substr(0, resultView.length - 1)
      resultValue = resultValue.substr(0, resultValue.length - 1);
    }

    this.setState({ value: resultValue, text: resultView });

    x.debug.log({ value: resultValue, text: resultView });

    if (this.props.onChange) {
      this.props.onChange({ value: this.state.value, text: this.state.text });
    }
  }
}

export default Application;