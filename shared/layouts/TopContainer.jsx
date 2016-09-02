import React from 'react';

class TopContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  render() {
    return (
      // <!--header begin-->
      <nav className="navbar navbar-inverse navbar-fixed-top x-freeze-height">
        <div className="navbar-padding">
          <div className="navbar-header">
            <button type="button" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar" className="navbar-toggle collapsed"></button>
            <a href="/" className="navbar-brand"><img alt="Brand" src="/resources/images/corporation/default/corporation.logo.png" /></a>
          </div>
          <div className="navbar-collapse collapse">
            <ul className="nav navbar-nav">
              {
                // top menu
              }
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i className="fa fa-user"></i> <strong>Name</strong></a>
                <ul className="dropdown-menu" role="menu">
                  <li><a href="/account/settings/admin">帐号设置</a></li>
                  <li><a href="/account/settings/applications">应用管理</a></li>
                </ul>
              </li>
              <li>
                <p className="navbar-text">
                  <i className="fa fa-sign-out"></i> <a href="javascript:void(0);" onClick={this.handleLogout}>退出</a>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      // <!--header end-->
    );
  }

  handleLogout() {
    // masterpage.logout();
  }
}

export default TopContainer;
