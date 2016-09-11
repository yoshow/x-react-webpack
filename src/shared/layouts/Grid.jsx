import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Grid extends React.Component {
  constructor(props) {
    super(props);

    this.state = { columns: props.columns, data: props.data };

    // console.log(data);
  }

  render() {
    return (
      <div className="table-freeze">
        <div className="table-freeze-head">
          <table className="table" >
            <thead>
              <tr>
                {
                  this.state.columns.map(function (node) {
                    var widthValue = {};

                    if (node.width) {
                      widthValue = { width: node.width };
                    }

                    if (node.icon) {
                      return (<th key={node.name} style={widthValue} title={node.name} ><i className={node.icon}></i></th>);
                    }
                    else {
                      return (<th key={node.name} style={widthValue} title={node.name} >{node.name}</th>);
                    }
                  })
                }
                <th className="table-freeze-head-padding" ></th>
              </tr>
            </thead>
          </table>
        </div>
        <ReactCSSTransitionGroup
          transitionName="example"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          <div className="table-freeze-body">

            <table className="table table-striped">
              <colgroup>
                {
                  this.state.columns.map(function (node) {
                    var widthValue = {};

                    if (node.width) {
                      widthValue = { width: node.width };
                    }

                    return (<col key={node.name} style={widthValue} />);
                  })
                }
              </colgroup>
              <tbody>
                {
                  this.state.data.map(this.createBody.bind(this))
                }
              </tbody>
            </table>
          </div>
        </ReactCSSTransitionGroup>
      </div>
    );
  }

  createBody(node) {
    return (
      <tr key={"r-" + node.reactKey} >
        {
          this.state.columns.map(function (column) {
            var key = 'r-' + node.reactKey + "-c-" + column.reactKey;

            if (column.action) {
              // 操作列
              return (
                <td key={key} >
                  <a href="javascript:void(0);" onClick={() => { column.handle(node) } } title={column.name} ><i className={column.icon} ></i></a>
                </td>
              )
            }
            else if (!column.field || column.field == '') {
              return (<td key={key} ></td>)
            }
            else {
              if (column.render) {
                return (<td key={key} > { column.render(node) } </td>)
              }
              else {
                return (<td key={key} style={{ wordWrap: "break-word", wordBreak: "break-all" }} > { node[column.field]} </td>)
              }
            }
          })
        }
      </tr>
    )
  }
}

export default Grid;
