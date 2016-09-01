import React from 'react';

class AccountList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }
  componentDidMount() {
    $.get(this.props.source, function (result) {
      console.log(result);
      this.setState({data: result.data});
      // this.state.data = result.data;
    }.bind(this));
  }

  render() {
    return (
      <div className="AccountList">
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
