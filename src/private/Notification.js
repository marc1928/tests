import React, { useContext, useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import SkeletonTable from '../components/SkeletonTable'
import Swal from "sweetalert2";
import axiosClient from "../axios-client";
import { AuthContext } from "../context/AuthContext";

export default function Notification() {

  const [style, setStyle] = useState(
    "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled"
  );

  const changeStyle = () => {
      if (style === "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled") {
          setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
      } else {
          setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled");
      }
  }

  const [loadingskeletonbutton, setLoadingSkeletonButton] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const [filteredNotifications, setFilteredNotifications] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const filtered = notifications.filter((notification) =>{
      const searchString = `${notification.notification_content.toLowerCase()} ${notification.notification_created_at.toLowerCase()} ${notification.created_at.toLowerCase()}`;
      return searchString.includes(searchTerm.toLowerCase());
    });
    setFilteredNotifications(filtered);
  }, [notifications, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const { currentUser, token } = useContext(AuthContext);

  const getNotifications = async () => {
    setLoadingSkeletonButton(true);
    axiosClient.get(`/notification/${currentUser.id}`).then( ({data})=> {
      setNotifications(data.data);
      setLoadingSkeletonButton(false);
    }).catch(err => {
      setLoadingSkeletonButton(false);
    });
  };

  const handleSetState = async(id) => {
    let state = "read";
    const formData = new FormData();
    formData.append('_method', 'PUT');
    axiosClient.post(`/setstatenotification/${id}/${state}`,formData).then( () => {
      // Swal.fire({position: 'top-right',icon: 'success',title: 'Thanks you!',text: 'poste supprimée avec succès',showConfirmButton: true});
      getNotifications();
    }).catch(err => {
      const response = err.response;
      if (response.data.message) {
        Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: `Une erreur s'est produite lors du traitement de votre demande` ,showConfirmButton: true,confirmButtonColor: '#10518E',})
      }
    });
  };

  return (
    <div id="wrapper">
      <SideBar style={style} changeStyle={changeStyle} />
      <div id="content-wrapper" class="d-flex flex-column">
        <div id="content">
          <NavBar onSearch={handleSearch} changeStyle={changeStyle} />
          <div class="container-fluid">
            <div class="card shadow mb-4" style={{ overflowY : "scroll", scrollBehavior: "inherit", height : "84vh" }}>
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">
                        Mes Notifications
                    </h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                              <th>#</th>
                              <th>Message</th>
                              <th>Marquage</th>
                              <th>Date Du</th>
                              <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                          {loadingskeletonbutton ? <>{SkeletonTable(7,5)}</>:
                            <>
                                {filteredNotifications && filteredNotifications.map((notification,index) => {
                                    const descendingIndex = notifications.length - index;
                                    return (
                                    <tr onClick={() => notification.notification_state == "unread" ? handleSetState(notification.notification_id) : null } style={{ fontWeight : `${notification.notification_state == 'unread' ? 'bold' : '' }`, color : `${notification.notification_state == 'unread' ? 'black' : '' }` }}>
                                        <td style={{ fontSize : "16px", cursor : "pointer" }}>{ descendingIndex } </td>                                                                       
                                        <td style={{ fontSize : "16px" }}>
                                          {notification.notification_content}
                                        </td>    
                                        <td style={{ fontSize : "16px", cursor : "pointer" }}>
                                          {notification.notification_state == "unread" ? "Non lu" : "Lu"}
                                        </td> 
                                        <td title={notification.notification_created_at} style={{ fontSize : "16px", cursor : "pointer" }}>
                                          {notification.created_at}
                                        </td>  
                                        <td>
                                            {notification.notification_state == "unread" ? 
                                            <a onClick={() => handleSetState(notification.notification_id)} class="btn btn-sm btn-primary" style={{ textDecoration : "none", padding : "5px" }}>Marquer lu</a>
                                            : "Aucune" }
                                        </td>                                                                     
                                    </tr> 
                                    );
                                })} 
                            </>                     
                          }
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
