import React from 'react';

import Grid from '../../shared/layouts/Grid';

class AccountList extends React.Component {
  /**
   * 构造函数
   */
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { "name": "名称" },
        { "name": "状态", "width": "60px" },
        { "name": "操作", "width": "60px" },
        { "name": "编辑", "width": "30px", icon: "fa fa-edit" },
        { "name": "复制", "width": "30px", icon: "fa fa-copy" },
        { "name": "删除", "width": "30px", icon: "fa fa-trash" }
      ],
      data: []
    };

  }

  /**
   * 组件加载完事件  
   */
  componentDidMount() {
    $.get(this.props.source, function (result) {
      console.log(result);
      this.setState({ data: result.data });
      this.refs.grid.setState({ data: result.data });
    }.bind(this));
  }

  /**
   * 组件渲染事件  
   */
  render() {
    return (
      <div id="window-main-table-container">
        <Grid key={this.state.data} columns={this.state.columns} data={this.state.data} ref="grid"></Grid>
        {
          this.state.data.map(function (item) {
            // console.log(item);
            return <div key={item.name}>{item.name}</div>
          })
        }
      </div>
    );
  }
}

export default AccountList;
