import React from "react";

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.onBackClick = this.onBackClick.bind(this);
    this.onNextClick = this.onNextClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
  }
  onBackClick(e) {
    e.preventDefault();
    this.props.onBack(e);
  }
  onNextClick(e) {
    e.preventDefault();
    this.props.onNext(e);
  }
  onDeleteClick(e) {
    e.preventDefault();
    this.props.onDelete(e);
  }  
  render() {
    return (
      <div className="panel-footer">
        <div className="btn-group">
          <button className="btn btn-primary" onClick={this.onBackClick} disabled={!this.props.aloowBack}>
            Back
          </button>
          <button className="btn btn-primary" onClick={this.onNextClick} disabled={!this.props.aloowNext}>
            Next
          </button>
        </div>
          <button className="btn btn-primary pull-right" onClick={this.onDeleteClick} disabled={this.props.pageCount==1}>
            Delete
          </button>          
      </div>
    );
  }
}

export default Footer;
