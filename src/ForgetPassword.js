import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosClient from "./axios-client.js"
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import icon from './assets/img/logo.jpeg'

export default function ForgetPassword() {
  const navigate = useNavigate();
  const inputs = useRef([]);
  const [validationerror , setValidationError] = useState("");
  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);
  const [errorauthentification,setErrorAuthentification] = useState("");

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
      errors.email = 'Email is required';
    } else if (!isValidEmail(inputs.current[0].value)) {
      errors.email = 'Email address format is not valid';
    }

    if (Object.keys(errors).length === 0) {
      setLoadingSubmitButton(true);
      await axiosClient.get(`/forgetpassword/${inputs.current[0].value.trim()}`).then(({data})  => {
        Swal.fire({position: 'top-right',icon: 'success',title: 'Good!',text: 'Vous avez reçu un nouveau sur votre adresse mail',showConfirmButton: true,confirmButtonColor: '#10518E',})
        setValidationError(errors);
        setLoadingSubmitButton(false);
        navigate('/'); 
      }).catch(err => {
        const response = err.response;
        if (response && response.status === 422){
          if (response.data.errormessage) {
            errors.user = "Vous n'existez pas en tant qu'utilisateur";
            setErrorAuthentification(errors);
          }
        }
      });
      setLoadingSubmitButton(false);
    }else{
      setValidationError(errors);
    }
  }

  return (
  <div className="container-fluid" style={{ display : "flex",alignItems: "center",justifyContent: "center", minHeight: "100vh", background : "#f7f7f7", padding: "0 10px" }}>
    <div class="wrapper" style={{ background : "#fff", maxWidth : "450px",width : "100%",borderRadius : "5px", boxShadow : "0 0 128px 0 rgba(0, 0, 0, 0.1), 0 32px 64px -48px rgba(0, 0, 0, 0.5)" }}>
      <section class="form login">
        <header>
        <p style={{ textAlign : "center" }}>
          <img src={icon} style={{ height : "65px", objectFit:"cover" }}/>
        </p>
          <h6 style={{ textAlign: "center", color : "grey", fontWeight:"bold" }}>Recuperer votre mot de passe</h6>
        </header>
        <form ref={formRef}>
          {errorauthentification.user ? <div className="alert alert-danger">
            <>{ errorauthentification.user }
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button></>
          </div> : null}          
          <div class="field input">
            <label>Adress Mail</label>
            <input
              type="text"
              placeholder="Entrez Votre Adress Mail"
              ref={addInputs}
            />
            {validationerror.email && <span className="text-danger">{validationerror.email}</span>}
          </div>
          <div class="field button">
            <button type="submit" onClick={loadingsubmitbutton ? null : handleForm} name="submit" style={{ borderRadius : "5px",backgroundColor : "#61396d;" }} class="btn btn-primary w-100">
                {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin"></i> : <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></svg>}
                Envoyez-moi un nouveau mot de passe
            </button>
          </div>
          <br/>
          <p style={{ textAlign : "center" }}>
            <Link to="/" className="text-61396d">Connectez vous</Link>
          </p>
        </form>
      </section>
    </div>
  </div>
  );
}

