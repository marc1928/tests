import React, { useContext, useEffect, useRef, useState } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import axiosClient from "../axios-client";
import iconuser from '../assets/img/user-128.png'
import '../assets/css/custom_radio.css'

export default function Quizz() {

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

  const [timeLeft, setTimeLeft] = useState(60); // Temps initial en secondes

  // Décrémente le temps restant chaque seconde
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
    }, 1000);

    // Nettoie le timer à la fin
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getClassColor = () => {
    if (timeLeft >= 25) {
      return 'text text-primary';
    } else if (timeLeft > 12 && timeLeft < 25) {
      return 'text text-warning';
    } else {
      return 'text text-danger';
    }
  };

  return (
    <div id="wrapper">
      <SideBar style={style} changeStyle={changeStyle} />
      <div id="content-wrapper" class="d-flex flex-column">
        <div id="content">
          <NavBar changeStyle={changeStyle} />
          <div class="container-fluid">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h5 class="m-0 font-weight-bold text-primary">
                        Logiciels de Conception
                    </h5>
                </div>
            </div><br/>
            <div class="container-fluid" style={{width : "98%"}}>
                <div className='row'>
                    <div className='col-8'>
                        <h3>How To Create a Custom Radio Button ?</h3>
                    </div>
                    <div className='col-4'>
                        <h3 className={getClassColor()}>{timeLeft > 0 ? (
                                <div>Temps restant : {formatTime()}</div>
                            ) : (
                                <div>Temps écoulé !</div>
                        )}</h3>
                    </div>                
                </div><br/>
                <form>
                    <div className='row'>
                        <div className='col-12 mt-2'>                            
                            <label class="containercustomradio">Quel Sera Votre question concernant la crise economique
                                <input type="radio" name="radio"/>
                                <span class="checkmark"></span>
                            </label>
                        </div><br/>
                        <div className='col-12 mt-2'>                            
                            <label class="containercustomradio">Quel Sera Votre question concernant la crise economique
                                <input type="radio" name="radio"/>
                                <span class="checkmark"></span>
                            </label>
                        </div><br/>    
                        <div className='col-12 mt-2'>                            
                            <label class="containercustomradio">Quel Sera Votre question concernant la crise economique
                                <input type="radio" name="radio"/>
                                <span class="checkmark"></span>
                            </label>
                        </div><br/>    
                        <div className='col-12 mt-2'>                            
                            <label class="containercustomradio">Quel Sera Votre question concernant la crise economique
                                <input type="radio" name="radio"/>
                                <span class="checkmark"></span>
                            </label>
                        </div><br/>     
                    </div> 
                    <div className='row mt-2'>
                        <div className='col-xl-6 col-md-6'>
                            <button type="button" class="btn btn-lg btn-secondary text-white" style={{borderRadius: "5px",padding: "10px", float : "right"}}>
                                Cancel
                            </button>
                        </div> 
                        <div className='col-xl-6 col-md-6'>
                            <button type="button" class="btn btn-lg btn-primary text-white" style={{borderRadius: "5px",padding: "10px", float : "left"}}>
                                Valider
                            </button>
                        </div>                      
                    </div>
                </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}


