import React, { FC } from "react";
import Header from "../components/Header";
import { css } from "@emotion/css";

const box = css`
  width: 100%;
`;

const Contact: FC = () => {
  return (
    <div className={box}>
      <Header title="Contact" />
      <div>ini halaman contact</div>
    </div>
  );
};

export default Contact;
