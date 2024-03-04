import React, { useContext, useEffect, useRef, useState } from "react";
import UsePasswordToogle from "./components/UsePasswordToogle";
import { AuthContext } from "./context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosClient from "./axios-client.js"
import Cookies from "js-cookie";
import icon from './assets/img/logo.jpeg'

export default function SignIn() {
  const navigate = useNavigate();

  const {dispatch} = useContext(AuthContext);

  const [PasswordInputType, ToogleIcon] = UsePasswordToogle();

  const inputs = useRef([]);
  const [validationerror , setValidationError] = useState("");
  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);
  const [errorauthentification,setErrorAuthentification] = useState("");

  const [rememberMe, setRememberMe] = useState(false);
  const [user, setUser] = useState({ email : "", password : "" });

  const formRef = useRef();

  useEffect(() => {
    const rememberMeCookie = Cookies.get('rememberMe');
    if (rememberMeCookie) {
      setRememberMe(true);
      const userData = JSON.parse(rememberMeCookie);
      setUser(userData);
    }else{
      const userData = { email : "", password : "" };
      setUser(userData);
    }
  }, []);

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
      errors.email = 'Votre adresse email est requise';
    } else if (!isValidEmail(inputs.current[0].value)) {
      errors.email = 'Votre format d\'adresse email est non valide';
    }
    
    if (inputs.current[1].value.trim() === '') {
      errors.password = 'Votre mot de passe est requis';
    }

    if (Object.keys(errors).length === 0) {
      setLoadingSubmitButton(true);
      const datauser = {
        email : inputs.current[0].value.trim(),
        password : inputs.current[1].value.trim()
      }
      await axiosClient.post('/login',datauser).then(({data})  => {
        const { user, token } = data;

        if (rememberMe) {
          const userData = { email : inputs.current[0].value.trim(), password : inputs.current[1].value.trim() };
          Cookies.set('rememberMe', JSON.stringify(userData), { expires: 365 });
          setUser(userData);
        } else {
          Cookies.remove('rememberMe');
        }

        dispatch({ type: "LOGIN", payload: { user, token } });
        navigate('/Dashboard'); 
      }).catch(err => {
        const response = err.response;
        if(err.code === "auth/network-request-failed"){
          errors.checkingnetwork = 'Connexion internet requise';
          setValidationError(errors);
        }
        else if (response && response.status === 422) {
          if (response.data.errors) {
            if (response.data.errors.email) {
              errors.email = response.data.errors.email;
              setValidationError(errors);
            }
          } else {
            errors.queryCheckuser_Email_Password = response.data.message;
            setErrorAuthentification(errors);
            setValidationError(errors);
          }
        }
        else if (response && response.status === 500) {
          if (response.data.state) {
            if (response.data.state == 'waiting_for') {
              errors.queryCheckuser_Email_Password_activ = 'votre compte est en attente d\'activation';
              setErrorAuthentification(errors);
            }
            if (response.data.state == 'idle') {
              errors.queryCheckuser_State = 'Votre compte a été desactivé';
              setErrorAuthentification(errors);
            }
          }
        }
        else{
          errors.checkinglink = 'Erreur de chargement de l\'api, Veillez actualiser la page et ressayer Svp';
          setValidationError(errors);
        }
      });
      setLoadingSubmitButton(false);
    }else{
      setValidationError(errors);
    }
  }

  return (
  <div className="container-fluid" style={{ display : "flex",alignItems: "center",justifyContent: "center", minHeight: "100vh", backgroundColor : "#f7f7f7" , padding: "0 10px" }}>
    <div class="wrapper" style={{ background : "#fff", maxWidth : "450px",width : "100%",borderRadius : "5px", boxShadow : "0 0 128px 0 rgba(0, 0, 0, 0.1), 0 32px 64px -48px rgba(0, 0, 0, 0.5)" }}>
      <section class="form login">
        <header>
        <p style={{ textAlign : "center" }}>
          <img src={icon} style={{ height : "65px", objectFit:"cover" }}/>
        </p>
          <h5 style={{ textAlign: "center", color : "black", fontWeight:"bold" }}>Accedez A votre Espace De Gestion</h5>
        </header>
        <form ref={formRef}>
          {errorauthentification.queryCheckuser_Email_Password ? <div className="alert alert-danger">
            <>{ errorauthentification.queryCheckuser_Email_Password }
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button></>
          </div> : null}
          {errorauthentification.queryCheckuser_State ? <div className="alert alert-danger">{errorauthentification.queryCheckuser_State}</div> : null}
          {errorauthentification.queryCheckuser_Email_Password_activ ? <div className="alert alert-warning">
          <>{ errorauthentification.queryCheckuser_Email_Password_activ }
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button></>
          </div> : null}
          {validationerror.checkingnetwork ? <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <>{ validationerror.checkingnetwork }
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button></>
          </div>: null}
          {validationerror.checkinglink ? <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <>{ validationerror.checkinglink }
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button></>
          </div>: null}          
          <div class="field input">
            <label>Adress Mail</label>
            <input
              type="text"
              placeholder="Entrez Votre Adress Mail"
              defaultValue={ user.email ? user.email : "" }
              ref={addInputs}
            />
            {validationerror.email && <span className="text-danger">{validationerror.email}</span>}
          </div>
          <div class="field input">
            <label>Mot De Passe</label>
            <input
              type={PasswordInputType}
              placeholder="Entrez Votre Mot De Passe"
              defaultValue={ user.password ? user.password : ""}
              ref={addInputs}
            />
            {ToogleIcon}
            {validationerror.password && <span className="text-danger">{validationerror.password}</span>}
          </div>
          <br/>      
          <div class="field button">
            <button style={{ borderRadius : "5px", backgroundColor : "#61396d" }} onClick={handleForm} class="btn w-100 bg-0d569a text-white" type="button">
              {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin"></i> : null} Se Connecter
            </button>
          </div><br/>          
          <label style={{ cursor : "pointer" }}>
            <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)}/> Se souvenir de moi ?
          </label>
          <p style={{ float : "right" }}>
            <Link to='/Forget-Password'>
              <span className="text text-danger">Mot de passe oublié ?</span>
            </Link>
          </p><br/><br/>
          <p style={{ textAlign: "center" }}>
            <Link to="/Sign-Up" style={{ color : "#61396d" }}>Vous n'avez pas un Compte ? Creer le</Link>
          </p> 
        </form>
      </section>
    </div>
  </div>
  );
}
