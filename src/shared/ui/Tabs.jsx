import stylesheet from './Tabs.less';

import React from 'react';
import ReactDOM from 'react-dom';

class Tabs extends React.Component {
  constructor(props) {
    super(props);
    
    this.name = "tabs";

    this.state = {
      buttons: props.buttons,
      currentIndex: 0
    };
  }

  /**
   * 组件加载完事件  
   */
  componentDidMount() {
    x.debug.log(this.name + '.componentDidMount');
    this.setIndex(0);
  }
  render() {
    let _this = this;
    return (
      <div className="x-ui-pkg-tabs-wrapper">
        {/* 生成 Tab 按钮 */}
        {
          (() => {
            if (this.state.buttons) {
              return (
                <div className="x-ui-pkg-tabs-toolbar">
                  {
                    this.state.buttons.map(function (node) {
                      return <button key={node.name} id={node.name} onClick={node.handle.bind(this) } className={node.className} title={node.label}>{node.label}</button>;
                    })
                  }
                  <div className="clear"></div>
                </div>
              );
            }
          })()
        }

        {/* 生成 Tab 导航 */}
        <div className="x-ui-pkg-tabs-menu-wrapper">
          <ul className="x-ui-pkg-tabs-menu nav nav-tabs" >
            {
              React.Children.map(this.props.children, (element, index) => {
                return (
                  /* 箭头函数没有自己的 this, 这里的 this 继承自外围作用域, 即组件本身 */
                  <li><a href="javascript:void(0)" onClick={ () => { this.setIndex(index) } } className={ this.setClassName('menu', index) }>{element.props.name}</a></li>
                );
              })
            }
          </ul>
        </div>
        {/* Tab 内容区域 */}
        <div className="x-ui-pkg-tabs-containers">{
          React.Children.map(this.props.children, (element, index) => {
            return (
              <div className="x-ui-pkg-tabs-container" >
                <h2 className="x-ui-pkg-tabs-container-head-hidden"><a id="tab-1" name="tab-1" >{element.props.name}</a></h2>
                <div className={ this.setClassName('container', index) }>{element}</div>
              </div>
            );
          })
        }
        </div>
      </div>
    );
  }

  /**
  * 设置索引信息
  * @method setIndex
  * @memberof x.ui.tabs#
  */
  setIndex(index) {
   x.debug.log(index);
    this.setState({ currentIndex: index });
  }

  /**
  * 设置元素样式信息
  * @method setClassName
  * @memberof x.ui.tabs#
  */
  setClassName(type, index) {
    if (type == 'menu') {
      return index === this.state.currentIndex ? "active" : '';
    }
    else {
      return index === this.state.currentIndex ? "active" : "hidden";
    }
  }
}

export default Tabs;