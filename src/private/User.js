import React, { useEffect, useRef, useState } from 'react'
import Footer from '../components/Footer'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import { Link } from 'react-router-dom'
import SkeletonTable from '../components/SkeletonTable'
import Swal from 'sweetalert2'
import axiosClient from '../axios-client'
import icon from '../assets/img/user-128.png'
import { Modal } from 'react-bootstrap'
import UsePasswordToogle from '../components/UsePasswordToogle'

export default function User() {

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

  const [loadingbutton, setLoadingButton] = useState(false);

  const [users, setUsers] = useState([]);

  const [filteredUsers, setFilteredUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.user_lastname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setLoadingSkeletonButton(true);
    axiosClient.get('/users').then( ({data})=> {
      setUsers(data.data);
      setLoadingSkeletonButton(false);
    }).catch(err => {
      setLoadingSkeletonButton(false);
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalOpen = async () => {
    setShowModal(true);
  }


  const ChangeStateUser  = async(id,user_state) => {
    Swal.fire({
      title: 'Choisir une operation', icon: 'question',showDenyButton: true,showCancelButton: true, confirmButtonColor: '#61396d',confirmButtonText: 'Activer',denyButtonText: `Desactiver`, cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if(user_state !== "asset")
        {
          let state = "asset";
          const formData = new FormData();
          formData.append('_method', 'PUT');
          setLoadingButton(true);
          await axiosClient.post(`/setstate/${id}/${state}`,formData).then(async ({data})  => {
            const datanotification = { user_id : id, content : "Votre compte ont été activé avec succes", state : "unread", type : "user" };
            await axiosClient.post('/storenotification',datanotification);
            getUsers();
            Swal.fire({position: 'top-right',icon: 'success',title: 'Thanks you!',text: 'This User has been activated',showConfirmButton: true})
          }).catch(err => {
            const response = err.response;
            if (response && response.status === 422) {
              Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: 'An error occurred while executing the program',showConfirmButton: true,confirmButtonColor: '#61396d',})
            }
          });
          setLoadingButton(false);
        }
        else{
          Swal.fire({position: 'top-right',icon: 'warning',title: 'Information',text: 'This User is already active',showConfirmButton: true,confirmButtonColor: '#61396d',})
        }
      }
      else if (result.isDenied) {
        if(user_state !== "idle")
        {
          let state = "idle";
          const formData = new FormData();
          formData.append('_method', 'PUT');
          setLoadingButton(true);
          await axiosClient.post(`/setstate/${id}/${state}`,formData).then(async ({data})  => {
            getUsers();
            Swal.fire({position: 'top-right',icon: 'success',title: 'Thanks you!',text: 'This User has been deactivated',showConfirmButton: true})
          }).catch(err => {
            const response = err.response;
            if (response && response.status === 422) {
              Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: 'An error occurred while executing the program',showConfirmButton: true,confirmButtonColor: '#61396d',})
            }
          });
          setLoadingButton(false);
        }
        else{
          Swal.fire({position: 'top-right',icon: 'warning',title: 'Information',text: 'This User is already inactive',showConfirmButton: true,confirmButtonColor: '#61396d',})
        }
      }
    });
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const AddUser = async (event) =>{
    event.preventDefault();
    const errors = {};

    if (inputs.current[0].value.trim() === '') {
      errors.user_lastname = 'Votre nom est requis';
    }

    if (inputs.current[1].value.trim() === '') {
      errors.user_firstname = 'Votre prenom est requis';
    }

    if (inputs.current[2].value.trim() === '') {
      errors.user_email = 'Votre adresse email est requise';
    } else if (!isValidEmail(inputs.current[2].value)) {
      errors.user_email = 'Votre adresse email est non valide';
    } else if (!inputs.current[2].value.endsWith('@bpce-it.fr')) {
      errors.user_email = 'Votre adresse email doit se terminer par @bpce-it.fr';
    }  
    
    if (inputs.current[3].value.trim() === '') {
      errors.user_matricule = 'Votre matricule est requis';
    }    

    if (inputs.current[4].value.trim() === '') {
      errors.user_password = 'Votre mot de passe est requis';
    }
    else if (inputs.current[4].value.trim().length < 7) {
      errors.user_password = 'le mot de passe doit comporter au moins 7 caractères';
    }
    
    if (inputs.current[5].value.trim() === '') {
      errors.user_repeatpassword = 'Votre second mot de passe est requis';
    }
    else if (inputs.current[5].value.trim().length < 7) {
      errors.user_repeatpassword = 'le second mot de passe doit contenir au moins 7 caractères';
    }
    else if (inputs.current[4].value.trim() != inputs.current[5].value.trim()) {
      errors.user_repeatpassword = 'Les mots de passe doivent etre identiques';
    }

    if (Object.keys(errors).length === 0) {
      setLoadingSubmitButton(true);
      let user_state = "asset";
      const datauser = {lastname: inputs.current[0].value.trim(),firstname: inputs.current[1].value.trim(),email: inputs.current[2].value.trim(),matricule: inputs.current[3].value.trim(),password : inputs.current[4].value,img : null,state: user_state,role: "member"}
      await axiosClient.post('/signup',datauser).then(({data})  => {
        setSucces("Votre Compte a été créee avec succès");
        setTimeout(() => { setSucces('');}, 3000);
        Swal.fire({position: 'Center',icon: 'success',title: 'Success',text: 'Votre Compte a été créee avec succès.',showConfirmButton: true});
        formRef.current.reset();
        handleModalClose();
      }).catch(err => {
        const response = err.response;
        if(err.code === "auth/network-request-failed"){
          errors.checkingnetwork = 'Connexion internet requise';
          setValidationError(errors);
        }
        else if (response && response.status === 422) {
          if (response.data.errors.email) {
            errors.user_email = response.data.errors.email;
            Swal.fire({position: 'Center',icon: 'warning',title: 'Warning!',text: 'Ce compte existe déja!',showConfirmButton: true});
          }
          if (response.data.errors.matricule) {
            errors.user_matricule = response.data.errors.matricule;
          }  
          if (response.data.errors.password) {
            errors.user_password = response.data.errors.password;
          }                   
        }
      });
      setValidationError(errors);
    } else {
      setValidationError(errors);
    }

    setLoadingSubmitButton(false);
  }

  const inputs = useRef([]);
  const [validationerror , setValidationError] = useState("");
  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

  const [success,setSucces] = useState("");

  const formRef = useRef();

  const addInputs = el => {
    if (el && !inputs.current.includes(el)) {
      inputs.current.push(el)
    }
  }


  return (
    <div id="wrapper">
      <SideBar style={style} changeStyle={changeStyle} />
      <div id="content-wrapper" class="d-flex flex-column">
        <div id="content">
          <NavBar onSearch={handleSearch} changeStyle={changeStyle} />
          <div class="container-fluid">
            <div class="card shadow mb-4" style={{ overflowY : "scroll", scrollBehavior: "inherit", height : "84vh" }}>
                <div class="card-header py-3">
                    <h5 class="m-0 font-weight-bold text-primary">
                        Tous les Utilisateurs
                    </h5>
                    <h6 class="m-0 font-weight-bold text-primary float-right">
                        <Link onClick={() => handleModalOpen("")} title="Ajouter un utilisateur" class="btn btn-primary" style={{ borderRadius : "6px" }}><i class="fas fa-fw fa-plus"></i> </Link>
                    </h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nom</th>
                                <th>Prenom</th>
                                <th>Email</th>
                                <th>Statut</th>                                
                                <th>Matricule</th>
                                <th>Action 1</th>
                                <th>Action 2</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingskeletonbutton ? <>{SkeletonTable(7,7)}</>:
                                <>
                                    {filteredUsers && filteredUsers.map((user) => {
                                        let classState = "";
                                        let contentState = "";
                                        if (user.user_state === "asset") {classState = "bg-primary text-white";contentState = "Actif";} 
                                        else if (user.user_state === "idle") { classState = "bg-danger text-white";contentState = "Inactif";}
                                        else{ classState = "bg-warning text-white";contentState = "en Attente";}
                                        return (
                                        <tr>
                                            <td className="vertical-align-middle text-center">
                                              <Link to={!user.user_img || user.user_img == "" || user.user_img == null ? icon : user.user_img}>
                                                <img src={!user.user_img || user.user_img == "" || user.user_img == null ? icon : user.user_img} style={{ height: "40px", width: "40px", borderRadius: "10px", objectFit : "cover" }} /> 
                                              </Link>
                                            </td> 
                                            <td title={ user.user_lastname } style={{ fontSize : "16px", cursor : "pointer" }}>{ user.user_lastname } </td>
                                            <td style={{ fontSize : "16px" }}> { user.user_firstname } </td>
                                            <td style={{ fontSize : "16px" }}> { user.user_email } </td>
                                            <td style={{ fontSize : "16px" }}>
                                              <button class={`btn btn-circle ${classState}`} style={{ borderRadius : "50%",width: "90px", height : "40px", padding : "10px"}}>
                                                {contentState}
                                              </button>
                                            </td>
                                            <td style={{ fontSize : "16px" }}> { user.user_matricule } </td>
                                            <td>
                                              <a onClick={() => ChangeStateUser(user.user_id,user.user_state)} class="btn btn-sm btn-secondary" style={{ textDecoration : "none", backgroundColor : "#eeeeee",padding : "5px" }}><span class="text-success">act</span><span class="text-dark">/</span><span class="text-danger">dst</span> {loadingbutton ? <i class="fa fa-refresh fa-spin" style={{ color : "black" }}></i> : null} </a>
                                            </td>    
                                            <td>
                                              <a class="btn btn-sm btn-primary">Stats.. </a>
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
                <Modal show={showModal} onHide={handleModalClose}>
                  <Modal.Header>
                    <Modal.Title>                     
                      Nouvel Utilisateur
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form ref={formRef}>
                      {success ? <div class="alert alert-success alert-dismissible fade show" role="alert">
                          <>{ success }
                          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button></>
                      </div>: null}  
                      {validationerror.error ? <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        <>{ validationerror.error }
                          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button></>
                      </div>: null}
                      {validationerror.checkingnetwork ? <div class="alert alert-warning alert-dismissible fade show" role="alert">
                        <>{ validationerror.checkingnetwork }
                          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button></>
                      </div>: null}
                      <div class="col-12">
                        <label> Nom</label>
                        <input
                          type="text"
                          name="user_lastname"
                          className='form-control'
                          placeholder="Entrez Votre Nom Complet"
                          ref={addInputs}
                        />
                        {validationerror.user_lastname && <span className="text-danger">{validationerror.user_lastname}</span>}
                      </div>
                      <div class="col-12">
                        <label> Prenom</label>
                        <input
                          type="text"
                          className='form-control'
                          name="user_firstname"
                          placeholder="Entrez Votre Nom Complet"
                          ref={addInputs}
                        />
                        {validationerror.user_firstname && <span className="text-danger">{validationerror.user_firstname}</span>}
                      </div>          
                      <div class="col-12">
                        <label> Email</label>
                        <input
                          type="email"
                          className='form-control'
                          placeholder="Entrez Votre Adress Mail"
                          ref={addInputs}
                        />
                        {validationerror.user_email && <span className="text-danger">{validationerror.user_email}</span>}
                      </div>
                      <div class="col-12">
                        <label> Matricule</label>
                        <input
                          type="text"
                          className='form-control'
                          placeholder="Entrez Votre Matricule"
                          ref={addInputs}
                        />
                        {validationerror.user_matricule && <span className="text-danger">{validationerror.user_matricule}</span>}
                      </div>
                      <div class="col-12">
                        <label>Mot De Passe</label>
                        <input
                          type="password"
                          className='form-control'
                          placeholder="Entrez Votre Mot De Passe"
                          ref={addInputs}
                        />
                        {validationerror.user_password && <span className="text-danger">{validationerror.user_password}</span>}
                      </div>

                      <div class="col-12">
                        <label>Repeter Votre Mot De Passe</label>
                        <input
                          type="password"
                          className='form-control'
                          placeholder="Entrez Encore Votre Mot De Passe"
                          ref={addInputs}
                        />
                        {validationerror.user_repeatpassword && <span className="text-danger">{validationerror.user_repeatpassword}</span>}
                      </div><br/>

                      <div class="col-12">
                        <button class="btn btn-primary text-white" style={{borderRadius: "5px",padding: "5px", float : "right"}} onClick={AddUser}>
                          {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin"></i> : null} Enregistrer
                        </button>
                      </div><br/>
                    </form>
                  </Modal.Body>
                </Modal>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
