
import settings from '../settings'

import React from 'react';
import ReactDOM from 'react-dom';

import MainContainer from '../../shared/layouts/MainContainer';
import Grid from '../../shared/layouts/Grid';
import Mask from '../../shared/layouts/Mask';

class ApplicationEventList extends React.Component {
  /**
   * 构造函数
   */
  constructor(props) {
    super(props);

    // 分页对象
    this.paging = x.page.newPagingHelper(50);

    this.state = {

      // 配置数据列
      columns: [
        { reactKey: 0, "name": "事件", "field": "description" },
        {
          reactKey: 1, "name": "时间", "width": "160px", "field": "date",
          render: function (node) {
            return  x.date.newTime(node.date).toString('yyyy-MM-dd HH:mm:ss');;
          }
        }
      ],
      data: []
    };
  }

  /**
   * 组件加载完事件    
   */
  componentDidMount() {

    this.getPaging(1);

    masterpage.resize();
  }

  /**
   * 组件渲染事件    
   */
  render() {
    x.debug.log('application.event.list.render');
    return (
      <MainContainer name="应用事件管理" pagingData={this.paging} pagingHandle={(value) => { this.getPaging(value) } } ref="main" >
        <Grid key={this.state.data} columns={this.state.columns} data={this.state.data} ref="grid"></Grid>
      </MainContainer>
    );
  }

  /*#region 函数:getPaging(currentPage)*/
  /** 
  * 分页
  */
  getPaging(currentPage) {
    this.paging.currentPage = currentPage;

    var outString = '<?xml version="1.0" encoding="utf-8" ?>';

    outString += '<request>';
    outString += this.paging.toXml();
    outString += '</request>';

    x.net.xhr('/api/application.event.query.aspx', outString, {
      waitingType: 'mini',
      waitingMessage: i18n.strings.msg_net_waiting_query_tip_text,
      callback: function (response) {

        var result = x.toJSON(response);

        // 设置 reactKey 
        result.data.forEach(function (node) {
          node.reactKey = node.id;
        });

        this.paging.load(result.paging);

        this.refs.main.setState({ pagingData: this.paging });

        this.refs.grid.setState({ data: result.data });

      }.bind(this)
    });
  }
  /*#endregion*/

  /*#region 函数:confirmDelete(ids)*/
  /*
  * 删除对象
  */
  confirmDelete(id) {
    x.debug.log('application.event.list.confirmDelete - ' + id);
  }
  /*#endregion*/
}

export { ApplicationEventList };