import settings from '../settings'

import styles from './style.css';

import React from 'react';
import { render } from 'react-dom';

// https://github.com/css-modules/webpack-demo
// https://github.com/gajus/react-css-modules

import CSSModules from 'react-css-modules';

var styleDisplayNone = { display: "none" }

class SignIn extends React.Component {
  /**
   * 构造函数
   */
  constructor(props) {
    super(props);
    this.state = {
      loginName: this.props.loginName,
      password: this.props.password
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="window-sign-in-form-wrapper">
        <div className="window-sign-in-form-container">
          <div className="window-sign-in-form-input input-group" >
            <input id="loginName" maxLength="50" name="loginName" type="text" autoComplete="off" className="form-control" value={this.state.loginName} />
            <div className="input-group-addon"><i className="glyphicon glyphicon-user"></i></div>
          </div>
          <div className="window-sign-in-form-input input-group" >
            <input id="password" maxLength="50" name="password" type="password" className="form-control" value={this.state.password} onChange={this.handleChange} />
            <div className="input-group-addon"><i className="glyphicon glyphicon-lock"></i></div>
          </div>
          <div className="window-sign-in-form-remember-me">
            <div className="pull-left" ><a href="/account/forgot-password" target="_blank">忘记登陆密码?</a></div>
            <div className="pull-right" ><input id="remember" name="remember" type="checkbox" /> <span>忘记登录密码?</span></div>
          </div>
          <div className="window-sign-in-button-wrapper">
            <div className="window-sign-in-button-submit"><button id="btnSubmit" className="btn btn-success" onClick={this.handleClick}>登陆</button></div>
            <div className="window-sign-in-loading" style={styleDisplayNone}><img src="/resources/images/loading.gif" alt="登录中" /></div>
          </div>
          <div className="window-sign-in-form-bottom">
            <a href="account/sign-up.html">注册新帐号</a>
          </div>
        </div>
        <input id="session-client-id" name="session-client-id" type="hidden" value={settings.clientId} />
      </div>
    );
  }

  handleChange(event) {
    // this.setState({ name: event.target.value });
  }

  handleClick(event) {
    x.debug.log(this.state.loginName);
    x.debug.log(this.state.password);
    x.debug.log(event);
    x.debug.log(event.target);

    // this.setState({ name: event.target.value });

    // 登陆
    this.login();
  }

  /**
   * 登陆
   */
  login() {
    if ($('#loginName').val() == '' || $('#password').val() == '') {
      alert('必须填写帐号和密码。');
      return;
    }

    var outString = '<?xml version="1.0" encoding="utf-8" ?>';

    outString += '<request>';
    outString += '<loginName><![CDATA[' + $('#loginName').val() + ']]></loginName>';
    outString += '<password><![CDATA[' + CryptoJS.SHA1($('#password').val()).toString() + ']]></password>';
    outString += '</request>';

    $('.window-sign-in-loading').show();

    x.net.xhr('/api/connect.auth.authorize.aspx', outString, function (response) {
      var result = x.toJSON(response).message;

      switch (Number(result.returnCode)) {
        case 0:

          var data = x.toJSON(response).data;

          if ($('#remember')[0].checked) {
            // 记住当前用户登录信息
            var time = new Date(new Date().setDate(new Date().getDate() + 14));
            localStorage['cache-account'] = '{"loginName":"' + $('#loginName').val() + '"}';
          }
          else {
            localStorage.removeItem('cache-account');
          }

          localStorage['session-access-token'] = data.id;
          localStorage['session-access-refresh-token'] = data.refreshToken;
          localStorage['session-expireDate'] = data.expireDateTimestampView;

          var returnUrl = decodeURIComponent(x.net.request.find("returnUrl"));

          window.location.href = (returnUrl == '') ? '../' : returnUrl;
          break;

        case 1:
          x.msg(result.value);
          break;
      }

      $('.window-sign-in-loading').hide();
    });
  }
}

render((<SignIn />),
  document.getElementById('container')
);

// export default SignIn;
// export default CSSModules(SignIn, styles);
