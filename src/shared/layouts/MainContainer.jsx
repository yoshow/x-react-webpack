import React from 'react';

class AccountList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }
  componentDidMount() {
    $.get(this.props.source, function (result) {
      console.log(result);
      this.setState({ data: result.data });
      // this.state.data = result.data;
    }.bind(this));
  }

  render() {
    return (
      <div className="AccountList">
        <div id="window-container" className="window-container">
          <div id="window-main-table" className="table">
            <div id="window-main-table-header" className="table-header x-freeze-height">
              <div id="toolbar" className="table-toolbar">
                <button id="btnCreate" className="btn btn-default">新增</button>
              </div>
              <span>人像库列表</span>
              <input id="statusList" type="hidden" value="@ViewBag.status" />
            </div>
            <div id="window-main-table-body" className="table-body">
              <div className="table-row-filter form-inline text-right x-freeze-height">
                <input id="searchText" type="text" value="" className="form-control input-sm" />
                <button id="btnFilter" className="btn btn-default btn-sm" title="查询"><i className="glyphicon glyphicon-search"></i></button>
              </div>
              <div id="window-main-table-container">
                {
                  this.state.data.map(function (item) {
                    console.log(item);
                    return <div key={item.name}>{item.name}</div>
                  })
                }
              </div>
            </div>
            <div id="window-main-table-footer" className="table-footer x-freeze-height"></div>
          </div>
        </div>
        Hello, world!I am a AccountList.
        {
          this.state.data.map(function (item) {
            console.log(item);
            return <div key={item.name}>{item.name}</div>
          })
        }
      </div>
    );
  }
}

export default AccountList;
