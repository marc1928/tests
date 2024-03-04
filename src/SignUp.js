import React, { useContext, useEffect, useRef, useState } from "react";
import UsePasswordToogle from "./components/UsePasswordToogle";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosClient from "./axios-client";
import Swal from "sweetalert2";
import icon from './assets/img/logo.jpeg'

export default function SignUp() {

  const navigate = useNavigate();

  const [PasswordInputType, ToogleIcon] = UsePasswordToogle();

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

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleForm = async (event) =>{
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

    let checksuccess = 0;

    if (Object.keys(errors).length === 0) {
      setLoadingSubmitButton(true);
      let user_state = "waiting_for";
      const datauser = {lastname: inputs.current[0].value.trim(),firstname: inputs.current[1].value.trim(),email: inputs.current[2].value.trim(),matricule: inputs.current[3].value.trim(),password : inputs.current[4].value,img : null,state: user_state,role: "s_member"}
      await axiosClient.post('/signup',datauser).then(({data})  => {
        setSucces("Votre Compte a été créee avec succès");
        setTimeout(() => { setSucces('');}, 3000);
        Swal.fire({position: 'Center',icon: 'success',title: 'Success',text: 'Votre Compte a été créee avec succès.',showConfirmButton: true});
        formRef.current.reset();
        checksuccess = 1;
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
      if (checksuccess == 1) {
        navigate('/Sign-In'); 
      }
    } else {
      setValidationError(errors);
    }

    setLoadingSubmitButton(false);
  }
  return (
  <div className="container-fluid" style={{ display : "flex",alignItems: "center",justifyContent: "center", minHeight: "100vh", background : "#f7f7f7", padding: "0 10px" }}>
    <div class="wrapper" style={{ background : "#fff", maxWidth : "450px",width : "100%",borderRadius : "5px", boxShadow : "0 0 128px 0 rgba(0, 0, 0, 0.1), 0 32px 64px -48px rgba(0, 0, 0, 0.5)" }}>
      <section class="form login">
        <header>
        <p style={{ textAlign : "center" }}>
          <img src={icon} style={{ height : "65px", objectFit:"cover" }}/>
        </p>
          <h5 style={{ textAlign: "center", color : "black", fontWeight: "bold" }}>Creer Votre Compte Utilisateur</h5>
        </header>
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
          <div class="field input">
            <label> Nom</label>
            <input
              type="text"
              name="user_lastname"
              placeholder="Entrez Votre Nom Complet"
              ref={addInputs}
            />
            {validationerror.user_lastname && <span className="text-danger">{validationerror.user_lastname}</span>}
          </div>
          <div class="field input">
            <label> Prenom</label>
            <input
              type="text"
              name="user_firstname"
              placeholder="Entrez Votre Nom Complet"
              ref={addInputs}
            />
            {validationerror.user_firstname && <span className="text-danger">{validationerror.user_firstname}</span>}
          </div>          
          <div class="field input">
            <label> Email</label>
            <input
              type="email"
              placeholder="Entrez Votre Adress Mail"
              ref={addInputs}
            />
            {validationerror.user_email && <span className="text-danger">{validationerror.user_email}</span>}
          </div>
          <div class="field input">
            <label> Matricule</label>
            <input
              type="text"
              placeholder="Entrez Votre Matricule"
              ref={addInputs}
            />
            {validationerror.user_matricule && <span className="text-danger">{validationerror.user_matricule}</span>}
          </div>
          <div class="field input">
            <label>Mot De Passe</label>
            <input
              type={PasswordInputType}
              placeholder="Entrez Votre Mot De Passe"
              ref={addInputs}
            />
            {ToogleIcon}
            {validationerror.user_password && <span className="text-danger">{validationerror.user_password}</span>}
          </div>

          <div class="field input">
            <label>Repeter Votre Mot De Passe</label>
            <input
              type={PasswordInputType}
              placeholder="Entrez Encore Votre Mot De Passe"
              ref={addInputs}
            />
            {ToogleIcon}
            {validationerror.user_repeatpassword && <span className="text-danger">{validationerror.user_repeatpassword}</span>}
          </div>
          
          <br/>
          <div class="field button">
            <button style={{ borderRadius : "5px", backgroundColor : "#61396d" }} onClick={handleForm} class="btn w-100 bg-0d569a text-white" type="button">
              {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin"></i> : null} S'inscrire
            </button>
          </div><br/>
          <p style={{ textAlign: "center" }}>
            <Link to="/Sign-In" style={{ color : "#61396d" }}>Vous Avez Déja Un Compte ? Connectez-Vous</Link>
          </p>          
        </form>
      </section>
    </div>
  </div>
  );
}
