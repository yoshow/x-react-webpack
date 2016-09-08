
import settings from '../settings'

import React from 'react';
import ReactDOM from 'react-dom';

import MainContainer from '../../shared/layouts/MainContainer';
import Grid from '../../shared/layouts/Grid';
import Mask from '../../shared/layouts/Mask';

class ApplicationMethodList extends React.Component
{
  /**
   * 构造函数
   */
  constructor(props)
  {
    super(props);

    this.state = {
      // 分页对象
      paging: x.page.newPagingHelper(50),

      // 配置数据列
      columns: [
        { reactKey: 0, "name": "方法代码", "width": "160px", "field": "code" },
        { reactKey: 1, "name": "名称", "field": "name" },
        {
          reactKey: 2, "name": "状态", "width": "50px", "field": "status",
          render: function (node)
          {
            /*
            switch (node.statusView)
            {
              case '-1':
              case '草稿':
                return <span key={node.name} style={{ color: "tomato" }} title="草稿" ><i classNmae="fa fa-pencil-square"></i></span>;
              case '0':
              case '禁用':
                return <span key={node.name} classNmae="red-text" title="禁用" ><i classNmae="fa fa-times-circle"></i></span>;
              case '1':
              case '启用':
                return <span key={node.name} classNmae="green-text" title="启用" ><i classNmae="fa fa-check-circle"></i></span>;
              case '2':
              case '回收':
                return <span key={node.name} classNmae="gray-text" title="回收" ><i classNmae="fa fa-recycle"></i></span>;
              default:
                return statusView;
            }*/
            return node.statusView;
            // return x.date.newTime(node.modifiedDate).toString('yyyy-MM-dd');
          }
        },
        {
          reactKey: 3, "name": "修改日期", "width": "100px", "field": "modifiedDate",
          render: function (node) { return x.date.newTime(node.modifiedDate).toString('yyyy-MM-dd'); }
        },
        {
          reactKey: 4, "name": "删除", "width": "30px", icon: "fa fa-trash", action: true,
          // render: function (node) { return x.date.newTime(node.value).toString('yyyy-MM-dd'); }, 
          handle: function (node) { this.confirmDelete(node.id, node.applicationName); }.bind(this)
        }
      ],
      data: []
    };
  }

  /**
   * 组件加载完事件    
   */
  componentDidMount()
  {
    var outString = '<?xml version="1.0" encoding="utf-8" ?>';

    outString += '<request>';
    outString += paging.toXml();
    outString += '</request>';

    x.net.xhr('/api/application.method.query.aspx', outString, {
      waitingType: 'mini',
      waitingMessage: i18n.strings.msg_net_waiting_query_tip_text,
      callback: function (response)
      {
        var result = x.toJSON(response);

        result.data.forEach(function (node)
        {
          node.reactKey = node.id;
        });

        paging.load(result.paging);

        this.refs.grid.setState({ data: result.data });

        this.refs.main.setState({ paging: paging.tryParseMenu('javascript:main.applications.home.getPaging({0});') });

      }.bind(this)
    });

    masterpage.resize();
  }

  /**
   * 组件渲染事件    
   */
  render()
  {
    x.debug.log('application.method.list.render');
    return (
      <MainContainer name="应用方法管理" paging={this.state.paging} ref="main" >
        <Grid key={this.state.data} columns={this.state.columns} data={this.state.data} ref="grid"></Grid>
      </MainContainer>
    );
  }
  /*#region 函数:confirmDelete(ids)*/
  /*
  * 删除对象
  */
  confirmDelete(id)
  {
    x.debug.log('application.method.list.confirmDelete - ' + id);
  }
  /*#endregion*/

}

export { ApplicationMethodList };
