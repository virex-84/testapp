import React from "react";

class Page extends React.Component {
  render() {
    const page = this.props.data;
    return (
      <div className="panel-body">
        <h2>{page.title}</h2>
        <small>{page.description}</small>        
        <div className="blockquote">
        {page.text}
        <footer>{page.author}</footer>
        </div>
      </div>
    );
  }
}

export default Page;
