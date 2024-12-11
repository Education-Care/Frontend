import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../../Assets/homepage.png";
import {faBars, faXmark,} from "@fortawesome/free-solid-svg-icons";
import "../../Styles/Navbar.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { Avatar, Divider } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import MenuIcon from "@mui/icons-material/Menu";

function HeaderComponent() {
  const [nav, setNav] = useState(false);


  //06/12/2024: Anhhnl Begin
  const [userLogin, setUserLogin] = useState(null);
  //   const [userLogin, setUserLogin] = useState({
  //   userId: 1,
  //   name: "Thien",
  //   isAdmin: true,
  // });
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserLogin = localStorage.getItem("user_login");
      storedUserLogin && setUserLogin(JSON.parse(storedUserLogin));
      
      //Anhhnl Begin
      if (storedUserLogin) {
        const user = JSON.parse(storedUserLogin);
        toast.success(`Hello ${user.name}, Welcome to EduCare!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      //Anhhnl End
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_login");
    setUserLogin(null);
    toast.success("Logout successful", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  //06/12/2024: Anhhnl End



  // const [userLogin, setUserLogin] = useState({
  //   userId: 1,
  //   name: "Thien",
  //   isAdmin: true,
  // });


  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const openNav = () => {
    setNav(!nav);
  };

  return (
    <div className="navbar-section">
      <h1 className="navbar-title">
        <Link to="/">
          <img src={Logo} alt="Edu Care" className="navbar-logo" />
        </Link>
      </h1>

      {/* Desktop */}
      <ul className="navbar-items">
        <li>
          <Link to="/" className="navbar-links">
            Home
          </Link>
        </li>
        <li>
          <a href="#services" className="navbar-links">
            Services
          </a>
        </li>
        <li>
          <a href="#about" className="navbar-links">
            About
          </a>
        </li>
        <li>
          <a href="#reviews" className="navbar-links">
            Reviews
          </a>
        </li>
        <li>
          <a href="#doctors" className="navbar-links">
            Doctors
          </a>
        </li>
        <li>
          <a href="/EduCare/survey" className="navbar-links">
            Survey
          </a>
        </li>
      </ul>

      {/* Live Chat Button */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-8 text-white">
          <span
            className="flex items-center gap-2 border px-2 py-1 rounded-full cursor-pointer bg-white"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <MenuIcon sx={{ color: "#1A8EFD" }} />
            <Avatar
              alt={userLogin?.fullName}
              sx={
                true
                  ? { width: 30, height: 30, bgcolor: "#1A8EFD" }
                  : { width: 30, height: 30 }
              }
              src={
                userLogin && userLogin.avatarUrl
                  ? `${userLogin?.avatarUrl}`
                  : ``
              }
            />
          </span>
          {userLogin && (
            <Menu
              className="rouned-lg"
              id="account-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  mt: 1,
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {/* <MenuItem onClick={handleClose}>
                <Link className="w-full text-gray-600" to={"/history-survey"}>
                  Lịch sử khảo sát
                </Link>
              </MenuItem> */}
              <MenuItem onClick={handleClose}>
                <Link className="w-full text-gray-600" to={"/profile"}>
                  Personal Information
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link className="w-full text-gray-600" to={"/"}>
                  Schedule Appointment
                </Link>
              </MenuItem>
              {userLogin?.isAdmin && (
                <div>
                  <MenuItem onClick={handleClose}>
                    <Link className="w-full text-gray-600" to={"/"}>
                      User Management
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Link
                      className="w-full text-gray-600"
                      to={{
                        pathname: "/some/path",
                        search: "?query=string",
                        hash: "#hash",
                      }}
                    >
                      Survey Question Management
                    </Link>
                  </MenuItem>
                </div>
              )}
              <Divider />
              <MenuItem onClick={handleClose}>
                <Link className="w-full text-gray-600" to="/help">
                  Help Center
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <p
                  className="w-full text-red-600"
                   onClick={handleLogout}
                >
                  Log Out
                </p>
              </MenuItem>
            </Menu>
          )}
          {!userLogin && (
            <Menu
              className="rouned-lg"
              id="account-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  mt: 1,
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleClose}>
                <Link className="w-full text-gray-600" to ={"/login"}>
                  Log In
                </Link>
              </MenuItem>
              <Divider light />
              <MenuItem onClick={handleClose}>
                <Link className="w-full text-gray-600" href="/become-host">
                  Talk To Us
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link className="w-full text-gray-600" href="/help">
                  Help Center
                </Link>
              </MenuItem>
            </Menu>
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className={`mobile-navbar ${nav ? "open-nav" : ""}`}>
        <div onClick={openNav} className="mobile-navbar-close">
          <FontAwesomeIcon icon={faXmark} className="hamb-icon" />
        </div>

        <ul className="mobile-navbar-links">
          <li>
            <Link onClick={openNav} to="/">
              Home
            </Link>
          </li>
          <li>
            <a onClick={openNav} href="#services">
              Services
            </a>
          </li>
          <li>
            <a onClick={openNav} href="#about">
              About
            </a>
          </li>
          <li>
            <a onClick={openNav} href="#reviews">
              Reviews
            </a>
          </li>
          <li>
            <a onClick={openNav} href="#doctors">
              Doctors
            </a>
          </li>
          <li>
            <a onClick={openNav} href="/EduCare/survey">
              Survey
            </a>
          </li>
          <li>
            <a onClick={openNav} href="#contact">
              Contact
            </a>
          </li>
        </ul>
      </div>

      {/* Hamburger Icon */}
      <div className="mobile-nav">
        <FontAwesomeIcon
          icon={faBars}
          onClick={openNav}
          className="hamb-icon"
        />
      </div>
    </div>
  );
}

export default HeaderComponent;
