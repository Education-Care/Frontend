import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../../Assets/homepage.png";
import "../../Styles/Navbar.css";

import { Avatar, Divider } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import MenuIcon from "@mui/icons-material/Menu";

function HeaderComponent() {
  const [nav, setNav] = useState(false);
  const [userLogin, setUserLogin] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserLogin = localStorage.getItem("user_login");
      storedUserLogin && setUserLogin(JSON.parse(storedUserLogin));

      if (storedUserLogin) {
        const user = JSON.parse(storedUserLogin);
        toast.success(`Hello ${user.name}, Welcome to EduCare!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          toastId: "welcome",
        });
      }
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

    navigate("/"); // Chuyển hướng về trang chủ sau khi logout
  };

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
    <div className="navbar-section fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-4 bg-white shadow-md">
      <h1 className="navbar-title">
        <Link to="/">
          <img src={Logo} alt="Edu Care" className="navbar-logo" />
        </Link>
      </h1>

      {/* Desktop */}
      <ul className="navbar-items">
        {/* Only show the menu if the user is not an admin */}
        {!userLogin?.isAdmin ? (
          <>
            <li>
              <Link to="/" className="navbar-links">
                Home
              </Link>
            </li>
            <li>
              <Link to="/survey" className="navbar-links">
                Assessments
              </Link>
            </li>
            <li>
              <Link to="/entertainment" className="navbar-links">
                Entertainment
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/AdminDashboard" className="navbar-links">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/SurveyManagement" className="navbar-links">
                Survey Management
              </Link>
            </li>
            <li>
              <Link to="/EntertainmentManagement" className="navbar-links">
                Entertainment Management
              </Link>
            </li>
            <li>
              <Link to="/UserManagementPage" className="navbar-links">
                User Management
              </Link>
            </li>
          </>
        )}
      </ul>

      {/* Live Chat Button */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-8 text-white">
          {userLogin ? (
            <>
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
                  src={userLogin?.avatarUrl || ""}
                />
              </span>
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
                {/* User-specific menu items */}
                {!userLogin?.isAdmin && (
                  <>
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
                  </>
                )}

                {/* Admin-specific menu items */}
                {userLogin?.isAdmin && (
                  <div>
                    <MenuItem onClick={handleClose}>
                      <Link
                        className="w-full text-gray-600"
                        to={"/AdminDashboard"}
                      >
                        Dashboard
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Link
                        className="w-full text-gray-600"
                        to={"/SurveyManagement"}
                      >
                        Survey Question Management
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Link
                        className="w-full text-gray-600"
                        to={"/EntertainmentManagement"}
                      >
                        Entertainment Management
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Link
                        className="w-full text-gray-600"
                        to={"/UserManagementPage"}
                      >
                        User Management
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
                  <p className="w-full text-red-600" onClick={handleLogout}>
                    Log Out
                  </p>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <div>
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-500 text-white px-4 py-2 rounded-full"
              >
                Login
              </button>
            </div>
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
