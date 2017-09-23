/* @flow */

import React, { Component } from "react";
import invariant from "fbjs/lib/invariant";

type ObserverEntry = {
  target: HTMLElement,
};

type LayoutAnimationType =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out";

type LayoutAnimationConfig = {
  duration: number,
  delay?: number,
  type?: LayoutAnimationType,
};

type TransformKeyframe = {
  translateX: number,
  translateY: number,
  scaleX: number,
  scaleY: number,
};

const defaultKeyframeFactory = () => ({
  translateX: 0,
  translateY: 0,
  scaleX: 1.0,
  scaleY: 1.0,
});

function LayoutAnimation() {
  /* =========== Layout Animation Manager =========== */

  // Manager Instance Properties
  let pendingConfig: ?LayoutAnimationConfig = undefined;
  const observedElements: Set<HTMLElement> = new Set();
  const prevCache = new Map();

  function registerElement(view: HTMLElement) {
    observedElements.add(view);
  }

  function deregisterElement(view: HTMLElement) {
    observedElements.delete(view);
  }

  function transformKeyframeToCSSString(
    transformKeyframe: TransformKeyframe
  ): string {
    let result = "";

    Object.keys(transformKeyframe).forEach(propName => {
      const value = transformKeyframe[propName];

      if (["translateX", "translateY"].includes(propName)) {
        result += `${propName}(${value}px) `;
      } else {
        result += `${propName}(${value}) `;
      }
    });

    return result;
  }

  function getStartingKeyframe(
    prevRect: ClientRect,
    nextRect: ClientRect
  ): TransformKeyframe {
    const result = defaultKeyframeFactory();

    if (prevRect.left !== nextRect.left) {
      result.translateX = prevRect.left - nextRect.left;
    }

    if (prevRect.top !== nextRect.top) {
      result.translateY = prevRect.top - nextRect.top;
    }

    if (prevRect.width !== nextRect.width) {
      result.scaleX = prevRect.width / nextRect.width;
    }

    if (prevRect.height !== nextRect.height) {
      result.scaleY = prevRect.height / nextRect.height;
    }

    return result;
  }

  function constructAndApplyLayoutAnimation(
    target: HTMLElement,
    pendingAnimationConfig: LayoutAnimationConfig
  ): Promise<void> {
    const prevRect = prevCache.get(target);

    invariant(
      prevRect,
      `Observed HTMLElement is attempting to animate without a previously measured boundingRect.`
    );

    const nextRect = target.getBoundingClientRect();

    if (JSON.stringify(prevRect) === JSON.stringify(nextRect)) {
      return Promise.resolve();
    }

    const startingKeyframe = getStartingKeyframe(prevRect, nextRect);
    const existingTransform = target.style.transform;

    const animationKeyframes = [
      {
        transform: `${existingTransform} ${transformKeyframeToCSSString(
          startingKeyframe
        )}`,
      },
      {
        transform: existingTransform,
      },
    ];

    const animationConfig = {
      duration: pendingAnimationConfig.duration,
      delay: pendingAnimationConfig.delay || 0,
      easing: pendingAnimationConfig.type || "linear",
      fill: "backwards",
      composite: "add",
    };

    return target.animate(animationKeyframes, animationConfig).finished;
  }

  function handleLayoutChange(
    entries: ObserverEntry[],
    observer: any
  ): Promise<void> {
    observer.disconnect();

    const pendingAnimationConfig = pendingConfig;

    if (pendingAnimationConfig == null) {
      return Promise.resolve();
    }

    pendingConfig = undefined;

    const animations = [];
    for (let entry of entries) {
      animations.push(
        constructAndApplyLayoutAnimation(entry.target, pendingAnimationConfig)
      );
    }
    return Promise.all(animations).then(() => Promise.resolve());
  }

  function configureNext(config: LayoutAnimationConfig) {
    pendingConfig = config;

    const ro = new ResizeObserver(handleLayoutChange);

    prevCache.clear();

    for (let element of observedElements) {
      prevCache.set(element, element.getBoundingClientRect());
      ro.observe(element);
    }
  }

  /* =========== Layout Animation React Component =========== */

  class LayoutAnimatedNode extends Component {
    node: HTMLElement;

    componentDidMount() {
      if (this.node != null) {
        registerElement(this.node);
      }
    }

    componentWillUnmount() {
      if (this.node != null && observedElements.has(this.node)) {
        deregisterElement(this.node);
      }
    }

    render() {
      const { style, ...restProps } = this.props;
      return (
        <div
          {...restProps}
          ref={node => {
            this.node = node;
          }}
          style={{
            ...style,
            transformOrigin: "top left",
            willChange: "transform",
          }}
        />
      );
    }
  }

  return {
    configureNext,
    Node: LayoutAnimatedNode,
  };
}

export default LayoutAnimation();
