import "./global.css";

import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import LayoutAnimation from "./LayoutAnimation";
import Demo from "./Demo";

const rootEl = document.getElementById("root");

ReactDOM.render(
  <AppContainer>
    <Demo />
  </AppContainer>,
  rootEl
);

if (module.hot) {
  module.hot.accept("./Demo", () => {
    const NextDemo = require("./Demo").default; // eslint-disable-line global-require

    // If the result of a hot-module reload causes a change in layout, animate the change
    LayoutAnimation.configureNext({
      duration: 1000,
      type: "ease",
    });

    ReactDOM.render(
      <AppContainer>
        <NextDemo />
      </AppContainer>,
      rootEl
    );
  });
}
