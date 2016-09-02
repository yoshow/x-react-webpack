import React from 'react';

class ApplicationMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  render() {
    return (
      <div id="windowApplicationMenuContainer" className="x-ui-pkg-menu-slide-menu-container">
        <div id="windowApplicationMenuWrapper" className="x-ui-pkg-menu-slide-menu-wrapper">
          <div className="x-ui-pkg-menu-slide-menu-submenu first-child" ><span>大库引擎</span>
            <a id="f8fab120-16d8-40fb-922a-65cc5274e3f5" href="/" target="_self" ><i className="fa fa-cubes" ></i>  控制台</a>
            <a id="0f346e3b-5ba7-4297-836b-0b8cbb09e67d" href="/build" target="_self" ><i className="fa fa-search" ></i>  人像搜索</a>
            <a id="65eb4641-e62d-4b16-9cc6-1cd6564f97fb" href="inbox" target="_self" className="current" ><i className="fa fa-users" ></i>  人像库管理</a>
            <a id="ec0b1929-2428-494f-85dd-50c6c7ab6611" href="/about" target="_self" ><i className="fa fa-tasks" ></i>  任务管理</a>
          </div>
        </div>
      </div>
    );
  }
}

export default ApplicationMenu;
