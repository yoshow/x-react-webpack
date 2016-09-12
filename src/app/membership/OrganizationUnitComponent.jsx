import React from 'react';

class OrganizationUnitComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: this.props.name };
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <div>
        name: {this.state.name}
        <form className="AccountForm">
          <input type="text" placeholder="Your name" value={this.state.name} onChange={this.handleChange} />
          <input type="text" placeholder="Say something..." />
          <input type="submit" value="Post" />
          <button id="" >确定</button>
        </form>
      </div>
    );
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }
}

export default OrganizationUnitComponent;