const transitionDuration = 150;

const defaultStyle = {
  transition: `opacity ${transitionDuration}ms linear ${
    transitionDuration * 1.5
  }ms`,
  // transitionDelay: ``,
  opacity: 0,
};

const transitionStyles = {
  entering: { opacity: 0, position: "absolute" },
  entered: { opacity: 1 },
  exiting: { opacity: 1 },
  exited: { opacity: 0, position: "absolute" },
};

export { defaultStyle, transitionStyles, transitionDuration };
