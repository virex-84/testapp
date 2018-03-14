import React from "react";

class Reload extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }
  onClick(e) {
    e.preventDefault();
    this.props.onReload(e);
  }
  
  render() {
    return (
        <button className="btn btn-primary" onClick={this.onClick}>
        Обновить
        </button>

    );
  }
}

export default Reload;
