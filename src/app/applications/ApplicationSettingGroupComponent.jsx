
import settings from '../settings'

import React from 'react';
import ReactDOM from 'react-dom';

import MainContainer from '../../shared/layouts/MainContainer';
import Grid from '../../shared/ui/Grid';
import Mask from '../../shared/ui/Mask';

class ApplicationSettingGroupList extends React.Component
{
  /**
   * 构造函数
   */
  constructor(props)
  {
    super(props);
    x.debug.log('application.option.list.constructor');
    this.state = {
      columns: [
        { "name": "名称", "field": "applicationName" },
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
  componentDidMount()
  {
    var paging = x.page.newPagingHelper(50);

    var outString = '<?xml version="1.0" encoding="utf-8" ?>';

    outString += '<request>';
    outString += paging.toXml();
    outString += '</request>';

    var me = this;

    x.net.xhr('/api/application.option.query.aspx', outString, {
      waitingType: 'mini',
      waitingMessage: i18n.strings.msg_net_waiting_query_tip_text,
      callback: function (response)
      {
        var result = x.toJSON(response);

        paging.load(result.paging);

        me.refs.grid.setState({ data: result.data });
      }.bind(this)
    });

    masterpage.resize();
  }

  /**
   * 组件渲染事件  
   */
  render()
  {
    x.debug.log('application.option.list.render');
    return (
      <MainContainer name="应用参数分组">
        <Grid key={this.state.data} columns={this.state.columns} data={this.state.data} ref="grid"></Grid>
      </MainContainer>
    );
  }
}

export default { ApplicationSettingGroupList };
