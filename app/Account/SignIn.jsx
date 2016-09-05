import styles from './style.css';

import React from 'react';
import ReactDOM from 'react-dom';

// https://github.com/css-modules/webpack-demo
// https://github.com/gajus/react-css-modules

import CSSModules from 'react-css-modules';

var styleDisplayNone = { display: "none" }

class SignIn extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className="window-sign-in-form-wrapper">
        <div className="window-sign-in-form-container">
          <div className="input-group" >
            <input id="loginName" maxlength="50" name="loginName" type="text" autocomplete="off" className="form-control" value="" />
            <div className="input-group-addon"><i className="glyphicon glyphicon-user"></i></div>
          </div>
          <div className="input-group" >
            <input id="password" maxLength="50" name="password" type="password" className="form-control" value="" />
            <div className="input-group-addon"><i className="glyphicon glyphicon-lock"></i></div>
          </div>
          <div className="window-sign-in-form-remember-me">
            <div className="pull-left" ><a href="/account/forgot-password" target="_blank">Forgot login password?</a></div>
            <div className="pull-right" ><input id="remember" name="remember" type="checkbox" /> <span>Remember login name</span></div>
          </div>
          <div className="window-sign-in-button-wrapper">
            <div className="window-sign-in-button-submit"><button id="btnSubmit" className="btn btn-success">Sign in</button></div>
            <div className="window-sign-in-loading" style={styleDisplayNone}><img src="/resources/images/loading.gif" alt="登录中" /></div>
          </div>
          <div className="window-sign-in-form-bottom">
            <a href="/account/sign-up">Create new account</a>
          </div>
        </div>
      </div>

    );
  }
}

// export default SignIn;
export default CSSModules(SignIn, styles);
