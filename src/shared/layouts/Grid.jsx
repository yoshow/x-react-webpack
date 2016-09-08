import React from 'react';

class Grid extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = { columns: props.columns, data: props.data };

    // console.log(data);
  }

  render()
  {
    return (
      <div className="table-freeze">
        <div className="table-freeze-head">
          <table className="table" >
            <thead>
              <tr>
                {
                  this.state.columns.map(function (node)
                  {
                    var widthValue = {};

                    if (node.width)
                    {
                      widthValue = { width: node.width };
                    }

                    if (node.icon)
                    {
                      return (<th key={node.name} style={widthValue} title={node.name} ><i className={node.icon}></i></th>);
                    }
                    else
                    {
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
                this.state.columns.map(function (node)
                {
                  var widthValue = {};

                  if (node.width)
                  {
                    widthValue = { width: node.width };
                  }

                  return (<col key={node.name} style={widthValue} />);
                })
              }
            </colgroup>
            <tbody>
              {
                this.state.data.map(function (node)
                {
                  return (
                    <tr key={"r-" + node.reactKey} >
                      {
                        this.state.columns.map(function (column)
                        {
                          var key = 'r-' + node.reactKey + "-c-" + column.reactKey;

                          if (column.action)
                          {
                            // 操作列
                            return (
                              <td key={key} >
                                <a href="javascript:void(0);" onClick={() => { column.handle(node) } } title={column.name} ><i className={column.icon} ></i></a>
                              </td>
                            )
                          }
                          else if (!column.field || column.field == '')
                          {
                            return (<td key={key} ></td>)
                          }
                          else
                          {
                            if (column.render)
                            {
                              return (<td key={key} > { column.render(node[column.field]) } </td>)
                            }
                            else
                            {
                              return (<td key={key} > { node[column.field]} </td>)
                            }
                          }
                        })
                      }
                    </tr>
                  )
                }.bind(this))
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  createRow(node)
  {
    console.log(node);

    return (
      <tr key={"application" + node.id} >
        <td key={ node.id} >{node['applicationDisplayName']}</td>
      </tr>
    );
  }

  createBody()
  {
    // console.log(columns);
    this.state.data.map(function (node)
    {
      console.log(node);
      return (
        <tr key={node.name} >
          {
            this.columns.map(function (column)
            {
              if (!column.field || column.field == '')
              {
                return (<td key={column.id} ></td>);
              }
              else
              {
                console.log(column);
                return (<td key={column.id + '' + node.id} >{node[column.field]}</td>);
              }
            })
          }
        </tr>
      );
    });
  }
}

export default Grid;
