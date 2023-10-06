import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import styled from "@emotion/styled";
import Navbar from "./components/Navbar";

const ContainerStyled = styled.div({
  display: "flex",
  margin: "1rem 7%",
});

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <ContainerStyled>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/contact" element={<Contact />}></Route>
            <Route path="/contact-app" element={<Home />} />
          </Routes>
        </ContainerStyled>
      </Router>
    </div>
  );
}

export default App;
