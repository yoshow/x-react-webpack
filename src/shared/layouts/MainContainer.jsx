import React from 'react';

import Paging from './Paging';

class MainContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.name,
      buttons: props.buttons,
      renderFilters: props.renderFilters,
      tree: props.tree,
      pagingData: props.pagingData,
      pagingHandle: props.pagingHandle
    };

    x.debug.log(this.state.buttons);
  }
  componentDidMount() {
    x.debug.log('main.componentDidMount - ' + this.state.pagingData);
  }

  render() {
    return (
      <div id="window-container" className="window-container">
        <div id="window-main-table" className="table">
          <div id="window-main-table-header" className="table-header x-freeze-height">
            <div id="toolbar" className="table-toolbar">
              {
                (() => {
                  if (this.state.buttons) {
                    return this.state.buttons.map(function (node) {
                      return <button key={node.name} id={node.name} onClick={node.handle.bind(this) } className="btn btn-default"><i className={node.icon} title={node.label}></i> {node.label}</button>;
                    });
                  }
                })()
              }
            </div>
            <span>{this.state.name}</span>
          </div>
          {
            (() => {
              if (this.state.renderFilters) {
                return this.state.renderFilters();
              }
              else {
                // return (
                // <div className="table-row-filter form-inline text-right x-freeze-height">
                //  <input id="searchText" type="text" defaultValue="" className="form-control input-sm" style={{ marginRight: "4px" }}/>
                //  <button id="btnFilter" className="btn btn-default btn-sm" title="查询"><i className="glyphicon glyphicon-search"></i></button>
                // </div> );
              }
            })()
          }
          {
            (() => {
              if (this.state.tree) {
                // console.log(this.state.tree);
                return (
                  <div id="window-main-table-body" className="table-body">
                    <table className="table table-nopadding">
                      <tbody>
                        <tr>
                          <td className="table-sidebar">
                            <div id="window-main-table-sidebar">
                              <div className="table-sidebar-search form-inline">
                                <input id="searchText" type="text" defaultValue="" className="table-sidebar-search-text form-control input-sm" style={{ marginRight: "4px" }} />
                                <button id="btnFilter" className="btn btn-default btn-sm" title="查询"><i className="glyphicon glyphicon-search"></i></button>
                              </div>
                              <div id="treeViewContainer" className="table-sidebar-tree-view" dangerouslySetInnerHTML={ this.createMarkup() }></div>
                            </div>
                          </td>
                          <td>
                            <div id="window-main-table-container">
                              {this.props.children}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )
              } else {
                return (
                  <div id="window-main-table-body" className="table-body">
                    <div id="window-main-table-container">
                      {this.props.children}
                    </div>
                  </div>
                );
              }
            })()
          }
          <div id="window-main-table-footer" className="table-footer x-freeze-height">
            {
              (() => {
                if (this.state.pagingData) {
                  return <Paging key={this.state.pagingData.currentPage} data={this.state.pagingData} handle={this.state.pagingHandle} />
                }
              })()
            }
          </div>
        </div>
      </div>
    );
  }

  createMarkup() {
    return { __html: this.state.tree.toString() };
  };
}

export default MainContainer;
