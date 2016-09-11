import React from 'react';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'

const ACTIVE = { color: 'red' }

class ApplicationMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], html: '' };
    // x.debug.log(props);
  }

  /**
   * 组件加载完事件  
   */
  componentDidMount() {
    x.debug.log("app.applicationMenu.componentDidMount.");

    var outString = '<?xml version="1.0" encoding="utf-8" ?>';

    outString += '<request>';
    outString += '<query>';
    outString += '<where>';
    outString += '<key name="ApplicationId" ><![CDATA[' + this.props.applicationId + ']]></key>';
    // outString += '<key name="ParentId" ><![CDATA[' + this.props.parentId + ']]></key>';
    outString += '<key name="MenuType" ><![CDATA[ApplicationMenu]]></key>';
    outString += '<key name="Status" ><![CDATA[1]]></key>';
    outString += '<status><![CDATA[1]]></status>';
    outString += '</where>';
    outString += '<orders><![CDATA[OrderId]]></orders>';
    outString += '</query>';
    outString += '</request>';
    //" ApplicationId = ##{0}## AND ParentId=##{1}## AND MenuType = ##ApplicationMenu## AND Status = 1 ORDER BY OrderId "

    x.net.xhr('/api/application.menu.findAll.aspx', outString, function (response) {
      // console.log(response);
      var result = x.toJSON(response);

      this.setState({ data: result.data });
    }.bind(this));
  }

  render() {
    return (
      <div id="windowApplicationMenuContainer" className="x-ui-pkg-menu-slide-menu-container">
        <div id="windowApplicationMenuWrapper" className="x-ui-pkg-menu-slide-menu-wrapper">
          <div className="x-ui-pkg-menu-slide-menu-submenu first-child" ><span>大库引擎</span></div>
          {
            this.state.data.map(function (item) {
              // console.log(item);
              if (item.displayType == 'MenuGroup') {
                return <div key={item.id} className="x-ui-pkg-menu-slide-menu-submenu" ><span key={item.key} >{item.Name}</span></div>
              }
              else if (item.displayType == 'MenuSplitLine') {

              }
              else {
                if (item.iconPath == '') { item.iconPath = 'fa fa-bars' }
                return <div key={item.id}><Link id={item.id} to={item.url} ><i className={item.iconPath} ></i> {item.name}</Link></div>
              }
            })
          }
        </div>
      </div>
    );
  }
}

export default ApplicationMenu;
