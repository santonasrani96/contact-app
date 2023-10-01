import React from "react";
import { css } from "@emotion/css";

const style = css`
  color: hotpink;
  border: 1px solid pink;
  padding: 2rem;
`;

function App() {
  return <div className={style}>Hello World with React + Emotion</div>;
}

export default App;
