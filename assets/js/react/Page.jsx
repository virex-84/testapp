import React from "react";

class Page extends React.Component {
  render() {
    const page = this.props.data;
    return (
      <div className="panel-body">
        <h2>{page.title}</h2>
        <p>{page.text}</p>
      </div>
    );
  }
}

export default Page;
