// Subset declaration of the ResizeObserver class
// Need because the builtin flowtype defs don't include it yet
declare class ResizeObserver {
  observe(element: HTMLElement): void,
  disconnect(): void,
}

// Extend HTMLElement def to include Web Animations API (which doesn't yet exist in builtin typedefs)
declare interface HTMLElement extends HTMLElement {
  animate: (any[], any) => { finished: Promise<void> },
}
