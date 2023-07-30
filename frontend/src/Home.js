import React from "react";
import { Link } from "react-router-dom";
import logo from "./assets/basketballlogo.jpg";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

const Home = () => {
  return (
    <div>
      <Navbar className = "navbar-dark bg-dark" expand="lg">
        <Container fluid>
          <Link to="/" className = "navbar-brand ms-5">
          <img
                src= {logo}
                alt="Logo"
                width="30"
                height="24"
                className="d-inline-block align-text-top border border-dark rounded-3 me-2"
              />
              <strong className = "text-white">NBA-All</strong>
          </Link>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="d-flex ms-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
            <li className="nav-item">
              <Link to= '/game' className="nav-link text-white">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/playerhistory" className="nav-link text-white">
                Player Stats
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/morestats" className="nav-link text-white">
                ShotChart
              </Link>
            </li>
            <li className="nav-item">
              <Link to ="/teaminfo" className="nav-link text-white">
                TeamInfo
              </Link>
            </li>
            <li className="nav-item me-4">
              <Link to ="/login" className="nav-link text-white">
                Profile
              </Link>
            </li>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Home;
