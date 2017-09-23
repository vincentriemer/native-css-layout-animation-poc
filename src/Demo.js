/* @flow */

import * as React from "react";

import BrowserFeatureGate from "./BrowserFeatureGate";
import LayoutAnimation from "./LayoutAnimation";

const boxShadow = "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)";

const styles = {
  page: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FAFAFA",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  layoutAnimatedNode: {
    transformOrigin: "top left",
    willChange: "transform",
  },
  button: {
    flex: 1,
    fontSize: "1em",
  },
  buttonBar: {
    minHeight: 50,
    backgroundColor: "white",
    display: "flex",
    zIndex: 0,
    boxShadow,
  },
  childWrapper: {
    flex: 1,
  },
  demoSelectContainer: {
    position: "fixed",
    zIndex: 101,
    top: 60,
    left: 10,
  },
  demoSelect: {
    fontSize: "1em",
    boxShadow,
  },
  finaleTitle: {
    margin: 0,
    padding: 0,
    lineHeight: 1,
    fontSize: "10em",
  },
  finaleSubtitle: {
    margin: 0,
    padding: 0,
    lineHeight: 1,
    fontSize: "3.5em",
  },
};

const colors = ["#F44336", "#4CAF50", "#03A9F4", "#FFC107", "#9C27B0"];

function shuffle(a) {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    // $FlowFixMe
    [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
}

const AnimatedBox = ({ style, color = "#292D3E", children }) => (
  <LayoutAnimation.Node
    style={{
      ...styles.layoutAnimatedNode,
      backgroundColor: color,
      boxShadow,
      ...style,
    }}
  >
    {children}
  </LayoutAnimation.Node>
);

class App extends React.Component {
  state: {
    index: number,
    selectedDemo: string,
  };

  demos: {
    [name: string]: () => React$Element<any>,
  };

  constructor(props: {}) {
    super(props);

    this.demos = {
      "Basic Flexbox": this.basicFlexboxDemo,
      "Advanced Flexbox": this.advancedFlexboxDemo,
      "Rel/Abs Positioning": this.positioningDemo,
      "Scroll to Fixed": this.flowToFixedDemo,
      "Child Shuffle": this.shuffleDemo,
      "CSS Grid": this.gridDemo,
    };

    this.state = {
      index: 0,
      selectedDemo: Object.keys(this.demos)[0],
    };
  }

  applyKeys(...children: React$Element<any>[]): React$Element<any>[] {
    return children.map((child, index) =>
      React.cloneElement(child, { key: index, color: colors[index] })
    );
  }

  handleDemoChange = (event: SyntheticInputEvent) => {
    LayoutAnimation.configureNext({
      duration: 500,
      type: "ease",
    });
    this.setState({ selectedDemo: event.target.value });
  };

  handlePress = (index: number) => {
    return () => {
      if (index !== this.state.index) {
        LayoutAnimation.configureNext({
          duration: 500,
          type: "ease",
        });
        this.setState({
          index,
        });
      }
    };
  };

  renderButton = (index: number) => (
    <button style={styles.button} key={index} onClick={this.handlePress(index)}>
      {index}
    </button>
  );

  renderButtonBar = () => (
    <div style={styles.buttonBar}>{[0, 1].map(i => this.renderButton(i))}</div>
  );

  renderDemoSelect = () => (
    <div style={styles.demoSelectContainer}>
      <select
        style={styles.demoSelect}
        value={this.state.selectedDemo}
        onChange={this.handleDemoChange}
      >
        {Object.keys(this.demos).map(demoName => (
          <option key={demoName} value={demoName}>
            {demoName}
          </option>
        ))}
      </select>
    </div>
  );

  indexValue = (...values: any[]) => {
    return values[this.state.index];
  };

  basicFlexboxDemo = () => {
    const childStyle = { width: 100, height: 100 };
    return (
      <div
        style={{
          ...styles.childWrapper,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          flexDirection: this.indexValue("column", "row"),
        }}
      >
        {this.applyKeys(
          <AnimatedBox style={childStyle} />,
          <AnimatedBox style={childStyle} />,
          <AnimatedBox style={childStyle} />,
          <AnimatedBox style={childStyle} />,
          <AnimatedBox style={childStyle} />
        )}
      </div>
    );
  };

  advancedFlexboxDemo = () => {
    const childStyle = {
      flex: this.indexValue(1, undefined),
      margin: 20,
      minWidth: this.indexValue(undefined, 75),
      minHeight: this.indexValue(undefined, 75),
    };

    return (
      <div
        style={{
          ...styles.childWrapper,
          display: "flex",
          flexDirection: this.indexValue("column", "row-reverse"),
          justifyContent: this.indexValue(undefined, "space-around"),
        }}
      >
        {this.applyKeys(
          <AnimatedBox
            style={{
              ...childStyle,
              alignSelf: this.indexValue(undefined, "stretch"),
              width: this.indexValue(undefined, 150),
            }}
          />,
          <AnimatedBox
            style={{
              ...childStyle,
              alignSelf: this.indexValue(undefined, "flex-start"),
            }}
          />,
          <AnimatedBox
            style={{
              ...childStyle,
              alignSelf: this.indexValue(undefined, "center"),
              width: this.indexValue(undefined, 150),
              height: this.indexValue(undefined, 150),
            }}
          />,
          <AnimatedBox
            style={{
              ...childStyle,
              alignSelf: this.indexValue(undefined, "flex-end"),
            }}
          />,
          <AnimatedBox
            style={{
              ...childStyle,
              alignSelf: this.indexValue(undefined, "stretch"),
              width: this.indexValue(undefined, 150),
            }}
          />
        )}
      </div>
    );
  };

  positioningDemo = () => {
    const childStyle = {
      marginTop: 50,
      width: 75,
      height: 75,
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
      position: this.indexValue("relative", "absolute"),
    };

    return (
      <div
        style={{
          ...styles.childWrapper,
          position: "relative",
        }}
      >
        {this.applyKeys(
          <AnimatedBox style={childStyle} />,
          <AnimatedBox style={childStyle} />,
          <AnimatedBox style={childStyle} />,
          <AnimatedBox style={childStyle} />,
          <AnimatedBox style={childStyle} />
        )}
      </div>
    );
  };

  flowToFixedDemo = () => {
    const childStyle = {
      minHeight: this.indexValue(300, 400),
      marginBottom: 20,
    };

    return (
      <div
        style={{
          padding: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          overflowY: "scroll",
        }}
      >
        {this.applyKeys(
          <AnimatedBox
            style={this.indexValue(
              {
                ...childStyle,
                zIndex: 25,
              },
              {
                position: "fixed",
                width: undefined,
                right: 0,
                left: 0,
                top: 50,
                height: 75,
                zIndex: 50,
              }
            )}
          />,
          <AnimatedBox
            style={this.indexValue(
              {
                ...childStyle,
                zIndex: 25,
              },
              {
                position: "fixed",
                width: undefined,
                right: 0,
                left: 0,
                bottom: 0,
                height: this.indexValue(150, 75),
                zIndex: 50,
              }
            )}
          />,
          <AnimatedBox style={childStyle} />,
          <AnimatedBox style={childStyle} />,
          <AnimatedBox style={childStyle} />
        )}
      </div>
    );
  };

  shuffleDemo = () => {
    const childStyle = {
      height: 75,
    };

    const children = this.applyKeys(
      <AnimatedBox style={childStyle} />,
      <AnimatedBox style={childStyle} />,
      <AnimatedBox style={childStyle} />,
      <AnimatedBox style={childStyle} />,
      <AnimatedBox style={childStyle} />
    );

    shuffle(children);

    return (
      <div
        style={{
          ...styles.childWrapper,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "space-around",
          padding: "50px 25%",
        }}
      >
        {children}
      </div>
    );
  };

  gridDemo = () => {
    return (
      <div
        style={{
          ...styles.childWrapper,
          display: "grid",
          gridGap: 0,
          padding: 0,
        }}
      >
        {this.applyKeys(
          <AnimatedBox
            style={{
              gridColumn: this.indexValue("1", "2 / 4"),
              gridRow: "1 / 2",
            }}
          />,
          <AnimatedBox
            style={{
              gridColumn: this.indexValue("1", "4 / 5"),
              gridRow: this.indexValue("2 / 4", "1 / 2"),
            }}
          />,
          <AnimatedBox
            style={{
              gridColumn: this.indexValue("1", "2 / 5"),
              gridRow: this.indexValue("4 / 8", "2 / 9"),
            }}
          />,
          <AnimatedBox
            style={{
              gridColumn: "1",
              gridRow: this.indexValue("8 / 9", "1 / 10"),
            }}
          />,
          <AnimatedBox
            style={{
              gridColumn: this.indexValue("1", "2 / 5"),
              gridRow: "9 / 10",
            }}
          />
        )}
      </div>
    );
  };

  render() {
    return (
      <BrowserFeatureGate>
        <div style={styles.page}>
          {this.renderDemoSelect()}
          {this.renderButtonBar()}
          {this.demos[this.state.selectedDemo]()}
        </div>
      </BrowserFeatureGate>
    );
  }
}

export default App;
