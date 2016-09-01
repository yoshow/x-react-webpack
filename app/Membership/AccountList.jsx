import React from 'react';

class AccountList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }
  componentDidMount() {
    $.get(this.props.source, function (result) {
      console.log(result);
      this.state.data = result.data;
    }.bind(this));
  }

  render() {
    return (
      <div className="AccountList">
        Hello, world!I am a AccountList.
        {
          this.state.data.map(function (item) {
            return <div>{item.name}</div>
          })
        }
      </div>
    );
  }
}

export default AccountList;