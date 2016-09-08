import React from 'react';

class MainContainer extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      name: props.name,
      tree: props.tree,
      paging: props.paging
    };

    console.log(props.paging);
    console.log(props.paging.toString());
  }
  componentDidMount()
  {

  }

  render()
  {
    return (
      <div id="window-container" className="window-container">
        <div id="window-main-table" className="table">
          <div id="window-main-table-header" className="table-header x-freeze-height">
            <div id="toolbar" className="table-toolbar">
              <button id="btnCreate" className="btn btn-default">新增</button>
            </div>
            <span>{this.state.name}</span>
          </div>
          <div id="window-main-table-body" className="table-body">
            <div className="table-row-filter form-inline text-right x-freeze-height">
              <input id="searchText" type="text" value="" className="form-control input-sm" />
              <button id="btnFilter" className="btn btn-default btn-sm" title="查询"><i className="glyphicon glyphicon-search"></i></button>
            </div>
            <div id="window-main-table-container">
              {this.props.children}
            </div>
          </div>
          <div id="window-main-table-footer" className="table-footer x-freeze-height">{this.state.paging}</div>
        </div>
      </div>
    );
  }
}

export default MainContainer;
