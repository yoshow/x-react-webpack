import React from 'react';

class Paging extends React.Component {
  constructor(props) {
    super(props);

    this.state = { data: this.props.data, pages: this.getPagesNumber(this.props.data.currentPage, 2) };
  }

  /**
  * 设置页数
  */
  getPagesNumber(value, length) {
    var outString = '';

    var page = value;

    var counter;

    if (value - length > 0) {
      value -= length;
    }
    else {
      value = 1;
    }

    counter = value + (length * 2) + 1;

    if (counter > this.props.data.lastPage) {
      value = this.props.data.lastPage - (length * 2);
    }

    var list = [];

    for (var i = value; i < counter; i++) {
      if (i < 1) { continue; }

      if (i > this.props.data.lastPage ) { break; }

      list[list.length] = i;

      // outString += '<li ' + ((page == i) ? ('class="active"') : '') + ' ><a href="' + format.replace('{0}', i) + '" >';

      // outString += '<li ' + ((page == i) ? ('class="active"') : '') + ' ><a href="" >';
      // outString += ((page == i) ? ('<strong>' + i + '</strong>') : i);
      // outString += '</a></li>';
    }

    // return outString;
    // console.log(list);

    return list;
  }

  /**
   * 组件加载完事件    
   */
  componentDidMount() {

    this.state = { data: this.props.data, pages: this.getPagesNumber(this.state.data.currentPage, 2) };

    x.debug.log('paging.componentDidMount');
  }


  render() {
    x.debug.log('paging.render');
    return (
      <div className="form-inline text-right">
        <div className="form-group" style={{ padding: "0 10px 0 0" }} >
          共有{ this.state.data.rowCount }条信息 当前{ this.state.data.rowIndex + 1}-{this.state.data.rowIndex + this.state.data.pageSize }信息
        </div>
        <div className="form-group">
          <nav>
            <ul className="pagination pagination-sm">
              <li><a href={"javascript:void(" + this.state.data.firstPage + ");"} onClick={() => { this.handle(this.state.data.firstPage) } } aria-label="首页"><span className="glyphicon glyphicon-step-backward"></span></a></li>
              <li><a href={"javascript:void(" + this.state.data.previousPage + ");"} onClick={() => { this.handle(this.state.data.previousPage) } } aria-label="上一页"><span className="glyphicon glyphicon-triangle-left"></span></a></li>
              {
                this.state.pages.map(function (page) {
                  return <li key={page} className={ (this.state.data.currentPage == page ? "active" : "") } ><a href={"javascript:void(" + page + ");"} onClick={() => { this.handle(page) } } >{page}</a></li>;
                }.bind(this))
              }
              <li><a href={"javascript:void(" + this.state.data.nextPage + ");"} onClick={() => { this.handle(this.state.data.nextPage) } } aria-label="下一页"><span className="glyphicon glyphicon-triangle-right"></span></a></li>
              <li><a href={"javascript:void(" + this.state.data.lastPage + ");"} onClick={() => { this.handle(this.state.data.lastPage) } } aria-label="末页"><span className="glyphicon glyphicon-step-forward"></span></a></li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }

  handle(value) {
    x.debug.log('paging.handle - ' + value);
    this.props.handle(value);
  }
}

export default Paging;