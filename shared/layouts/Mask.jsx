import React from 'react';

class Mask extends React.Component {
  constructor(props) {
    super(props);
    this.state = { columns: props.columns, data: props.data };
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

        <div className="table-freeze-body">
          <table className="table table-striped">
            <colgroup>
              {
                this.state.columns.map(function (node) {
                  var widthValue = {};

                  if (node.width) {
                    widthValue = { width: node.width };
                  }

                  return (<col style={widthValue} />);
                })
              }
            </colgroup>
            <tbody>
              {
                this.state.data.map(function (node) {
                  console.log(node);
                  return (
                    <tr>
                      <td><span >{node.name}</span></td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  createBody() {
    this.state.data.map(function (node) {
      console.log(item);
      return (
        <tr id="data-row-{node.id}" >
          <td><span >{node.name}</span></td>
        </tr>
      );
    });
  }
}

export default Mask;
