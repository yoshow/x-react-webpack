
import settings from '../settings'

import React from 'react';
import ReactDOM from 'react-dom';

import MainContainer from '../../shared/layouts/MainContainer';
import Grid from '../../shared/layouts/Grid';
import Mask from '../../shared/layouts/Mask';

class ApplicationMethodList extends React.Component {
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
        { reactKey: 0, "name": "方法代码", "width": "160px", "field": "code" },
        {
          reactKey: 1, "name": "名称", "field": "name",
          render: function (node) {
            return <a href={"/applications/application/form?id=" + node.id} target="_blank" >{node.name}</a>;
          }
        },
        {
          reactKey: 2, "name": "状态", "width": "50px", "field": "status",
          render: function (node) {
            // console.log(node);

            switch (node.status) {
              case '-1':
              case '草稿':
                return <span key={node.name} style={{ color: "tomato" }} title="草稿" ><i className="fa fa-pencil-square"></i></span>;
              case '0':
              case '禁用':
                return <span key={node.name} className="red-text" title="禁用" ><i className="fa fa-times-circle"></i></span>;
              case '1':
              case '启用':
                return <span key={node.name} className="green-text" title="启用" ><i className="fa fa-check-circle"></i></span>;
              case '2':
              case '回收':
                return <span key={node.name} className="gray-text" title="回收" ><i className="fa fa-recycle"></i></span>;
              default:
                return node.status;
            }
          }
        },
        {
          reactKey: 3, "name": "修改日期", "width": "100px", "field": "modifiedDate",
          render: function (node) { return x.date.newTime(node.modifiedDate).toString('yyyy-MM-dd'); }
        },
        {
          reactKey: 4, "name": "删除", "width": "30px", icon: "fa fa-trash", action: true,
          handle: function (node) { this.confirmDelete(node.id); }.bind(this)
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

    x.net.xhr('/api/application.method.query.aspx', outString, {
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

  /**
   * 组件渲染事件    
   */
  render() {
    x.debug.log('application.method.list.render');
    return (
      <MainContainer name="应用方法管理" tree={ this.tree } pagingData={this.paging} pagingHandle={(value) => { this.getPaging(value) } } ref="main" >
        <Grid key={this.state.data} columns={this.state.columns} data={this.state.data} ref="grid"></Grid>
      </MainContainer>
    );
  }
  /*#region 函数:confirmDelete(ids)*/
  /*
  * 删除对象
  */
  confirmDelete(id) {
    x.debug.log('application.method.list.confirmDelete - ' + id);
  }
  /*#endregion*/

}

export { ApplicationMethodList };
