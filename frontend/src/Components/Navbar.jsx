import React from "react";
import { Link } from "react-router-dom";
import Logo from '../images/COSC.png';

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="web-title">
      <a className="navbar-brand" href="#">
            <img src={Logo} alt="Logo" className="navbar-logo" />
          </a>
          <h1>THE BOOK BAZAAR</h1>
      </div>
        <div className="container-fluid">

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse lower-nav" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
              <li className="nav-item">
                <Link className="nav-link home" to="/">
                  <h2 className="navBarLink">Home</h2>
                </Link>
              </li>
              <li>
                <Link to="/shop" className="nav-link">
                  <h2 className="navBarLink">Shop</h2>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link admin-dashboard"
                  to="/dashboard"
                >
                  <h2 className="navBarLink">Dashboard</h2>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link admin-dashboard"
                  to="/preferences"
                >
                  <h2 className="navBarLink">User Preferences</h2>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
