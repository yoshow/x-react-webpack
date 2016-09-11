import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import TopContainer from './TopContainer';

class AppView extends React.Component {
  /**
   * 构造函数
   */
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log('app.view.componentDidMount');
    // masterpage.resize();
  }

  /**
   * 构造函数
   */
  render() {
    console.log('app.view.render');
    // x.debug.log(app);

    // 未验证登陆
    if (!localStorage['session-access-token']) {
      location.href = "account/sign-in.html?returnUrl=" + location.href;
      return;
    }
    return (
      <div className="web-body">
        <div className="header" >
          <div className="header-container" >
            <TopContainer />
          </div>
        </div>
        <div className="header-placeholder" ></div>
        { this.props.children }
      </div>
    );
  }
}

class AppDetailView extends React.Component {
  /**
   * 构造函数
   */
  constructor(props) {
    super(props);
  }

  /**
   * 构造函数
   */
  render() {
    console.log('app.detail.view');
    return (
      <div className="web-body">
      </div>
    );
  }
}

export default { AppView, AppDetailView };
