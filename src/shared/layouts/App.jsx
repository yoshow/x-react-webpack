import React from 'react';

import TopContainer from './TopContainer';

class AppView extends React.Component {
  /**
   * 构造函数
   */
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log('componentDidMount - App View');
    // masterpage.resize();
  }

  /**
   * 构造函数
   */
  render() {
    console.log('render - App View');
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
        {this.props.children}
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
    console.log('DetailView');
    return (
      <div className="web-body">
      </div>
    );
  }
}

export default { AppView, AppDetailView };
