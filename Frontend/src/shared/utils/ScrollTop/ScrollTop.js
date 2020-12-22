import { Component } from "react";

class ScrollTop extends Component {
  state = {
    location: null
  };

  componentDidMount() {
    this.setState({ location: this.props.location.pathname });
  }

  componentDidUpdate() {
    if (this.props.location !== this.state.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

export default ScrollTop;
