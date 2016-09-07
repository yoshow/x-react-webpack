import React from 'react';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'

class TopMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  render() {
    return (
      <ul className="nav navbar-nav">
        <li><Link to="/applications/" >应用管理</Link></li>
        <li><Link to="/membership/" >用户管理</Link></li>
        <li><Link to="/bigdb/" >人像检索</Link></li>
      </ul>
    );
  }
}

export default TopMenu;
