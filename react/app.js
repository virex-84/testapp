import 'babel-polyfill';
import 'raf/polyfill';

import React from "react";
import { render } from "react-dom";
import Navigator from "./Navigator";
import Footer from "./Footer";
import Page from "./Page";

const styles = {
  fontFamily: "sans-serif"
};

let Pages = [
  {
    id: 0,
    title: "Home",
    text: "Some text about HOME page"
  },
  {
    id: 1,
    title: "Articles",
    text: "Articles some text"
  },
  {
    id: 2,
    title: "News",
    text: "Newest News"
  }
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCount: this.props.data.length,
      pageID: 0,
      page: this.props.data[0],
      aloowBack: false,
      aloowNext: true
    };
    this.backPage = this.backPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }
  backPage() {
    let aloowBack = this.state.pageID - 1 > 0;
    let aloowNext = this.state.pageID < this.state.pageCount;
    let pageID =
      this.state.pageID - 1 > -1 ? this.state.pageID - 1 : this.state.pageID;

    this.setState({
      pageID: pageID,
      page: this.props.data[pageID],
      aloowBack: aloowBack,
      aloowNext: aloowNext
    });
  }
  nextPage(e) {
    e.preventDefault();
    let aloowBack = this.state.pageID > -1;
    let aloowNext = this.state.pageID + 1 < this.state.pageCount - 1;
    let pageID =
      this.state.pageID + 1 < this.state.pageCount
        ? this.state.pageID + 1
        : this.state.pageID;

    this.setState({
      pageID: pageID,
      page: this.props.data[pageID],
      aloowBack: aloowBack,
      aloowNext: aloowNext
    });
  }
  render() {
    return (
      <div className="panel panel-default" style={styles}>
        <Navigator links="links" />
        <Page data={this.state.page} />
        <Footer
          onBack={this.backPage}
          onNext={this.nextPage}
          aloowBack={this.state.aloowBack}
          aloowNext={this.state.aloowNext}
        />
      </div>
    );
  }
}

render(<App data={Pages} />, document.getElementById("root"));
