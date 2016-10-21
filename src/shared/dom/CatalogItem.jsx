import React from 'react';
import ReactDOM from 'react-dom';

import { Mask, MaskManager } from '../../shared/ui/Mask';
import * as Effect from '../../shared/ui/Animations';

import CatalogItemWizard from '../../shared/wizards/CatalogItemWizard';

class CatalogItem extends React.Component {
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

  /**
   * 组件渲染事件  
   */
  render() {
    x.debug.log(this.name + '.render');
    return (
      <div className="input-group" style={ this.props.style } >
        <input id={ this.name + "-text" } type="text" value={ this.state.text } data-x-dom-data-required={ this.props.dataRequired } data-x-dom-data-required-warning={ this.props.dataRequiredWarning } className={ this.props.className }  onClick={ this.open.bind(this) } />
        <input id={ this.name } type="hidden" value={ this.state.value } data-x-dom-data-type={ this.props.dataType } />
        <a id={ this.name + "-btnEdit" } role="button" className="input-group-addon" title="编辑" onClick={ this.open.bind(this) } ><i className="glyphicon glyphicon-modal-window"></i></a>
      </div>
    );
  }

  open() {
    x.debug.log(this.name + '.open');

    MaskManager.open(
      <CatalogItemWizard name={ this.name }
        value={ this.state.value }
        text={ this.state.text }
        treeViewId={this.props.treeViewId}
        treeViewName={this.props.treeViewName}
        treeViewRootTreeNodeId={this.props.treeViewRootTreeNodeId}
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

export default CatalogItem;