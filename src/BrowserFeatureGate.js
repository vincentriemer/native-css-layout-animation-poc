/* @flow */

import React, { Component } from "react";

const styles = {
  nonCompliantContainer: {
    maxWidth: 600,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 50,
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
};

class BrowserFeatureGate extends Component {
  state: {
    compliantBrowser: boolean,
    supportsResizeObserver: boolean,
    supportsWebAnimationApi: boolean,
  };

  constructor(props: Object) {
    super(props);
    this.state = this.determineState();
  }

  determineState() {
    const supportsResizeObserver = typeof ResizeObserver !== "undefined";
    const supportsWebAnimationApi = document.documentElement
      ? typeof document.documentElement.animate !== "undefined"
      : false;

    return {
      compliantBrowser: supportsResizeObserver && supportsWebAnimationApi,
      supportsResizeObserver,
      supportsWebAnimationApi,
    };
  }

  componentDidMount() {
    if (this.state.compliantBrowser) {
      this.enableHighPerformanceGraphics();
    }
  }

  enableHighPerformanceGraphics() {
    // Most (if not all) of the animations are GPU intensive so this is a little hack
    // to force high performance graphics on machines like the MacBook Pro
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.visibility = "hidden";
    if (document.body && document.body.firstChild) {
      document.body.insertBefore(canvas, document.body.firstChild);
      const gl = canvas.getContext("webgl");
      if (!gl) return;
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
  }

  renderNonCompliantBrowser = () => (
    <div style={styles.nonCompliantContainer}>
      <h1>This Browser is Not Supported</h1>
      <p>
        This proof of concept leverages bleeding edge browser APIs and this
        browser only supports the following checked features:
      </p>
      <ul style={styles.list}>
        <li>
          <input
            type="checkbox"
            checked={this.state.supportsResizeObserver}
            disabled
            readOnly
          />{" "}
          <a href="http://caniuse.com/#feat=resizeobserver">ResizeObserver</a>
        </li>
        <li>
          <input
            type="checkbox"
            checked={this.state.supportsWebAnimationApi}
            disabled
            readOnly
          />{" "}
          <a href="http://caniuse.com/#feat=web-animation">
            Web Animations API
          </a>
        </li>
      </ul>
      <p>
        Currently, the only browser known to support all of the above features
        is{" "}
        <a href="https://www.google.com/chrome/browser/canary.html">
          Google Chrome Canary
        </a>{" "}
        with the <i>Experimental Web Platform Features</i> flag turned on.
      </p>
    </div>
  );

  render() {
    const { children } = this.props;

    return (
      <div>
        {this.state.compliantBrowser ? (
          children
        ) : (
          this.renderNonCompliantBrowser()
        )}
      </div>
    );
  }
}

export default BrowserFeatureGate;
