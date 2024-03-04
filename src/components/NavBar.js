import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosClient from "../axios-client";
import iconuser from '../assets/img/user-128.png'

export default function NavBar({ onSearch,changeStyle  }) {

  const [currentuser, setCurrentUser] = useState({});

  const [notifications, setNotifications] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  const { dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      dispatch({ type: "LOGOUT" });
      await axiosClient.post('/logout');
      navigate("/");
    } catch (error) {
      console.log(error);
      navigate("/");
    }
  };

  useEffect(() => {
    getCurrentUser() && getNotifications();
  }, []);

  const getCurrentUser = async () => {
    axiosClient.get(`/user`).then( ({data})=> {
      axiosClient.get(`/users/${currentUser.id}`).then( ({data})=> {
        setCurrentUser(data.data);
      }).catch(err => {
        navigate('/'); 
      });
    }).catch(err => {
      navigate('/'); 
    });
  };

  const { currentUser, token } = useContext(AuthContext);

  const getNotifications = async () => {
    axiosClient.get(`/notification-unread/${currentUser.id}`).then( ({data})=> {
      setNotifications(data.data);
    }).catch(err => {
      // navigate('/'); 
    });
  };

  return (
    <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      <button
        id="sidebarToggleTop"
        class="btn btn-link d-md-none rounded-circle mr-3"
        onClick={changeStyle}
      >
        <i class="fa fa-bars"></i>
      </button>

      <form class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
        <div class="input-group">
          <input
            type="text"
            class="form-control bg-light border-0 small"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={handleSearch}
            aria-label="Search"
            aria-describedby="basic-addon2"
          />
          <div class="input-group-append">
            <button class="btn btn-primary" type="button">
              <i class="fas fa-search fa-sm"></i>
            </button>
          </div>
        </div>
      </form>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item dropdown no-arrow d-sm-none">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="searchDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i class="fas fa-search fa-fw"></i>
          </a>
          <div
            class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
            aria-labelledby="searchDropdown"
          >
            <form class="form-inline mr-auto w-100 navbar-search">
              <div class="input-group">
                <input
                  type="text"
                  class="form-control bg-light border-0 small"
                  placeholder="Rechercher..."
                  aria-label="Search"
                  value={searchTerm}
                  onChange={handleSearch}
                  aria-describedby="basic-addon2"
                />
                <div class="input-group-append">
                  <button class="btn btn-primary" type="button">
                    <i class="fas fa-search fa-sm"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </li>

        <li class="nav-item dropdown no-arrow mx-1">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="alertsDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i class="fas fa-bell fa-fw"></i>
            {notifications.length > 0 && ( <span class="badge badge-danger badge-counter">{notifications.length > 2 ? '2+' : notifications.length }</span> )}
          </a>
          <div
            class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
            aria-labelledby="alertsDropdown"
          >
            <h6 class="dropdown-header">Notifications</h6>
              {notifications.length > 0 && notifications.map((notification, index) => (
              <a class="dropdown-item d-flex align-items-center">
                <div class="mr-3">
                  <div class="icon-circle bg-primary">
                    <i class="fas fa-file-alt text-white"></i>
                  </div>
                </div>
                <div>
                  <div class="small text-gray-500">{notification.notification_created_at}</div>
                  <span>
                    {notification.notification_content}
                  </span>
                </div>
              </a>
              ))}
              {notifications.length <= 0 ?
              <a class="dropdown-item d-flex align-items-center">
                <div class="mr-3"></div>
                <div> Aucune notification </div>
              </a> : null}
            <Link to="/Notifications" class="dropdown-item text-center small text-gray-500">
              tout afficher
            </Link>
          </div>
        </li>

        <div class="topbar-divider d-sm-block"></div>
        <li class="nav-item dropdown no-arrow">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="userDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span class="mr-2 d-lg-inline text-gray-600 small">
              {currentuser.user_firstname + " " + currentuser.user_lastname}
            </span>
            <img
              class="img-profile rounded-circle"
              src={currentuser.user_img == '' || currentuser.user_img == null  ? iconuser : currentuser.user_img }
            />
          </a>
          <div
            class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
            aria-labelledby="userDropdown"
          >
            <Link class="dropdown-item" to="/Profile">
              <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
              Parametres
            </Link>
            <a class="dropdown-item">
              <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
              Aide
            </a>
            <div class="dropdown-divider"></div>
            <Link
              class="dropdown-item"
              onClick={handleLogout}
            >
              <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
              Deconnexion
            </Link>
          </div>
        </li>
      </ul>
    </nav>
  );
}
