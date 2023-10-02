import React, { FC } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/css";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import { NavLink } from "react-router-dom";

const navbarLogo = css`
  font-size: 2rem;
  font-weight: 700;
  color: #ffff;
`;

const navbarNav = css`
  position: absolute;
  right: 6%;
`;

const hamburgerMenu = css`
  display: none;
`;

const nav = css`
  color: #ffff;
  display: inline-flex;
  align-items: center;
  font-size: 1.3rem;
  margin: 0 1rem;
  transition: 0.5s;
  text-decoration: none;
  &:hover {
    color: #000;
    cursor: pointer;
  }
`;

const Navigation = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 7%",
  //   position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  zIndex: "99999",
  backgroundColor: "#4267B2",
});

const Navbar: FC = () => {
  return (
    <Navigation>
      <span className={navbarLogo}>Contact Apps</span>

      <div className={navbarNav}>
        <NavLink to="/" className={nav}>
          <HomeIcon />
          &nbsp;Home
        </NavLink>

        <NavLink to="/contact" className={nav}>
          <ContactPhoneIcon />
          &nbsp;Contact
        </NavLink>
      </div>

      <span className={hamburgerMenu}>
        <MenuIcon />
      </span>
    </Navigation>
  );
};

export default Navbar;
