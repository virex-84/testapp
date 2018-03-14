import React from "react";

class Message extends React.Component {
  render() {
    let type="alert alert-"+this.props.data.type;
    return (
    <div className={type}>
     <strong>{this.props.data.title}</strong><pre>{this.props.data.message}</pre>
    </div>
    )
  }
}

export default Message;