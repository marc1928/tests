import React, { useContext, useEffect, useRef, useState } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import axiosClient from "../axios-client";
import iconuser from '../assets/img/user-128.png'

export default function Profile() {

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

  const { currentUser, token } = useContext(AuthContext);

  const [currentuser,setCurrentUser] = useState({});

  const [errors,setErrors] = useState({});

  const [success,setSuccess] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  const [progressfileimg,setProgressFileImg] = useState(null);

  const [fileurl,setFileUrl] = useState(null);

  const inputusers = useRef([]);

  const [loadingsubmituser, setLoadingSubmitUser] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const formRef = useRef();

  const navigate = useNavigate();

  const addInputsUser = el => {
    if (el && !inputusers.current.includes(el)) {
      inputusers.current.push(el)
    }
  }

  useEffect(() => {
    const getUserbyId = async () => {
      axiosClient.get(`/users/${currentUser.id}`).then( ({data})=> {
        setCurrentUser(data.data);
      }).catch(err => {
        console.log(err);
      });
    };
    currentUser.id && getUserbyId();
  }, [currentUser.id]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setFileUrl(URL.createObjectURL(file));
    } else {
      Swal.fire({position: 'Center',icon: 'warning',title: 'Oops!',text: 'Veuillez sélectionner un fichier image valide.',showConfirmButton: true});
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setProgressFileImg(null);
    const inputElement = document.getElementById('uploadImage');
    if (inputElement) {
      inputElement.value = '';
    }
  };

  const updateUser = async(event) => {
    event.preventDefault();
    const errors = {};

    if (inputusers.current[0].value.trim() === '') {
      errors.user_fulname = 'Le nom complet est requis';
    }  

    if (inputusers.current[1].value.trim() === '') {
      errors.user_phone = 'Le Numero de telephone est requis';
    }

    if (Object.keys(errors).length === 0) {
      if (!fileurl) {
        setLoadingSubmitUser(true);
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('fulname', inputusers.current[0].value.trim());
        formData.append('phone', inputusers.current[1].value.trim());

        if (inputusers.current[2].value.trim() != '') {
          formData.append('password', inputusers.current[2].value.trim());
        }

        await axiosClient.post(`/setprofile/${currentUser.id}`,formData).then(({data})  => {
          setSuccess("Informations Updated success !!");
          setLoadingSubmitUser(false);
          setProgressFileImg(null);
          setTimeout(() => { setSuccess('');}, 3000);
          Swal.fire({position: 'Center',icon: 'success',title: 'Thanks you!',text: 'Informations Updated success',showConfirmButton: true});
          setErrors(errors);
        }).catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: 'An error occurred while executing the program',showConfirmButton: true,confirmButtonColor: '#10518E',})
          }
        })
        setLoadingSubmitUser(false);
      } else {
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('img', selectedImage);
        formData.append('fulname', inputusers.current[0].value.trim());
        formData.append('phone', inputusers.current[1].value.trim());
        if (inputusers.current[2].value.trim() != '') {
          formData.append('password', inputusers.current[2].value.trim());
        }
        await axiosClient.post(`/setprofile/${currentUser.id}`,formData,{headers: {'Content-Type': 'multipart/form-data',},}).then(({data})  => {
          setSuccess("Informations Updated success !!");
          setLoadingSubmitUser(false);
          setProgressFileImg(null);
          setTimeout(() => { setSuccess('');}, 3000);
          Swal.fire({position: 'Center',icon: 'success',title: 'Thanks you!',text: 'Informations Updated success',showConfirmButton: true});
          setErrors(errors);
        }).catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: 'An error occurred while executing the program',showConfirmButton: true,confirmButtonColor: '#10518E',})
          }
        })
        setLoadingSubmitUser(false);
      }
    } else{
      setErrors(errors);
      setLoadingSubmitUser(false);
    }   
  }


  return (
    <div id="wrapper">
      <SideBar style={style} changeStyle={changeStyle} />
      <div id="content-wrapper" class="d-flex flex-column">
        <div id="content">
          <NavBar changeStyle={changeStyle} />
          <div class="container-fluid">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">
                        Modifier Mes Informations
                    </h6>
                </div><br/>
                <div class="container">
                  <form ref={formRef} encType="multipart/form-data">
                    <div class="form-group" style={{ alignItems : "center" }}>
                        <div class="wrapper">
                          <div class="image" style={{ textAlign : "center" }}>
                            <div className="row mb-3">
                              <label htmlFor="profileImage" className="col-md-4 col-lg-3 col-form-label"></label>
                              <div className="col-md-12 col-lg-12">
                                {selectedImage ? (
                                  <img src={URL.createObjectURL(selectedImage)} style={{ height: "150px", borderRadius : "50%",width : "150px", objectFit : "cover", boxShadow : "1px 3px 3px solid #eeeeee"}} />
                                ) : (
                                  <img src={currentuser.user_img == '' || currentuser.user_img == null  ? iconuser : currentuser.user_img} style={{ height: "150px", borderRadius : "50%",width : "150px", objectFit : "cover", boxShadow : "1px 3px 3px solid #eeeeee"}} />
                                )}
                                <div className="pt-2">
                                  <label htmlFor="uploadImage" className="btn btn-primary btn-sm" title="Upload new profile image">
                                    <i className="fas fa-upload" style={{ color : "white" }}></i>
                                    <input type="file" id="uploadImage" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                  </label>
                                  {selectedImage && (
                                    <button className="btn btn-danger btn-sm" style={{ marginTop : "-8px" }} onClick={handleImageRemove} title="Remove my profile image">
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  )}
                                </div>
                                {progressfileimg ? <div class="progress-bar" role="progressbar" style={{width:`${progressfileimg}%`, borderRadius : "20px"}} aria-valuemin="0" aria-valuemax="100">Upload {progressfileimg}%</div> : null}
                              </div>
                            </div>
                          </div>
                        </div>
                    </div><br/>
                    <div class="form-group">
                        <label>Nom : </label>
                        <input type="text" ref={addInputsUser} defaultValue={currentuser.user_lastname} style={{ width : "100%", padding : "7px", borderRadius : "3px", border: "2px solid grey", outline : "none" }}
                        placeholder="Nom"/><br/>
                        {errors.user_lastname ? <span className="text-danger">{errors.user_lastname}</span> : null}
                        <br/>
                    </div>
                    <div class="form-group">
                        <label>Prenom : </label>
                        <input type="text" ref={addInputsUser} defaultValue={currentuser.user_firstname} style={{ width : "100%", padding : "7px", borderRadius : "3px", border: "2px solid grey", outline : "none" }}
                        placeholder="Nom"/><br/>
                        {errors.user_firstname ? <span className="text-danger">{errors.user_firstname}</span> : null}
                        <br/>
                    </div>                    
                    <div class="form-group">
                        <label>Email : </label>
                        <input type="text" disabled defaultValue={currentuser.user_email} style={{ width : "100%", padding : "7px", borderRadius : "3px", border: "2px solid grey", outline : "none" }}
                        placeholder="Email"/><br/><br/>
                    </div> 
                    <div class="form-group">
                        <label>Matricule : </label>
                        <input type="text" defaultValue={currentuser.user_matricule} style={{ width : "100%", padding : "7px", borderRadius : "3px", border: "2px solid grey", outline : "none" }}
                        disabled  /><br/><br/>
                    </div>
                    <div class="form-group">
                        <label>Nouveau Mot de Passe : </label>
                        <input type={passwordVisible ? 'text' : 'password'} ref={addInputsUser} style={{ width : "100%", padding : "7px", borderRadius : "3px", border: "2px solid grey", outline : "none" }}
                        placeholder="Mot de Passe"/><br/>
                        {errors.user_password ? <span className="text-danger">{errors.user_password}</span> : null}
                        <br/>
                        <p>
                            <a onClick={togglePasswordVisibility} style={{ cursor : "pointer", padding : "5px" }} class="btn btn-sm btn-secondary">
                              {passwordVisible ? 'Cacher le mot de passe' : 'Voir le mot de passe'}
                            </a>
                        </p>
                    </div>    
                    <div class="text-center" style={{ marginTop : "15px" }}>
                      <button disabled={progressfileimg && progressfileimg < 100  ? 'disabled' : ''} type="submit" onClick={loadingsubmituser ? null :updateUser} class="btn btn-primary">
                          {loadingsubmituser ? <i class="fa fa-refresh fa-spin"></i> : null} Modifier
                      </button>
                    </div><br/>                                                                                                                
                  </form>
                </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

