import React, { FC } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/css";

const titlePage = css`
  font-size: 2rem;
  font-weight: 500;
  color: #6c757d;
`;

const Line = styled.hr`
  color: #6c757d;
  width: 100%;
  margin: 2rem 0;
`;

const headerPage = css`
  display: flex;
  justify-content: space-between;
  alignitems: "center";
`;

type PropType = {
  title: string;
  children?: React.ReactNode;
};

const Header: FC<PropType> = (props: PropType) => {
  return (
    <div>
      <div className={headerPage}>
        <div className={titlePage}>{props.title}</div>
      </div>
      <Line />
      {/* {props.children} */}
    </div>
  );
};

export default Header;
