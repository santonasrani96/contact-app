import React, { FC } from "react";
import Header from "../components/Header";
import { css } from "@emotion/css";

const box = css`
  width: 100%;
`;

const Home: FC = () => {
  return (
    <div className={box}>
      <Header title="Home" />
      <div>ini halaman home</div>
    </div>
  );
};

export default Home;
