import React, { useContext, useEffect, useRef, useState } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import iconuser from '../assets/img/user-128.png'
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import ReactQuill from "react-quill";
import { differenceInDays, format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,PieChart, Pie, Cell, Legend } from 'recharts';

const data = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];

const datapiechart = [
  { name: 'A', value: 400 },
  { name: 'B', value: 300 },
  { name: 'C', value: 300 },
  { name: 'D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard() {
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

    const currentDate = new Date();
    const dateTime = format(currentDate, "yyyy-MM-dd HH:mm:ss");

    const { currentUser, token } = useContext(AuthContext);
    
  return (
    <div id="wrapper">
      <SideBar style={style} changeStyle={changeStyle} />
      <div id="content-wrapper" class="d-flex flex-column">
        <div id="content">
          <NavBar changeStyle={changeStyle} />
          <div class="container-fluid">
            <div class="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 class="h3 mb-0 text-gray-800">Tableau de Bord</h1><br/>
                <Link to="/Quizz"  class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"> <i class="fas fa-solid fa-question fa-sm text-white-50"></i> Quizz en cours </Link>
            </div>
            <div class="row">
              <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-primary shadow h-100 py-2">
                  <div class="card-body">
                    <div class="row no-gutters align-items-center">
                      <div class="col mr-2">
                          <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                              Earnings (Monthly)</div>
                          <div class="h5 mb-0 font-weight-bold text-gray-800">$40,000</div>
                      </div>
                      <div class="col-auto">
                          <i class="fas fa-calendar fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-success shadow h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                    Earnings (Annual)</div>
                                <div class="h5 mb-0 font-weight-bold text-gray-800">$215,000</div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
              </div>

              <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-info shadow h-100 py-2">
                    <div class="card-body">
                        <div class="row no-gutters align-items-center">
                            <div class="col mr-2">
                                <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Tasks
                                </div>
                                <div class="row no-gutters align-items-center">
                                    <div class="col-auto">
                                        <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">50%</div>
                                    </div>
                                    <div class="col">
                                        <div class="progress progress-sm mr-2">
                                            <div class="progress-bar bg-info" role="progressbar"
                                                style={{width : "50%"}} aria-valuenow="50" aria-valuemin="0"
                                                aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-auto">
                                <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                            </div>
                        </div>
                    </div>
                </div>
              </div>   

              <div class="col-xl-3 col-md-6 mb-4">
                  <div class="card border-left-warning shadow h-100 py-2">
                      <div class="card-body">
                          <div class="row no-gutters align-items-center">
                              <div class="col mr-2">
                                  <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                      Pending Requests</div>
                                  <div class="h5 mb-0 font-weight-bold text-gray-800">18</div>
                              </div>
                              <div class="col-auto">
                                  <i class="fas fa-comments fa-2x text-gray-300"></i>
                              </div>
                          </div>
                      </div>
                  </div>
              </div> 
            </div>
            <div class="row">
                <div class="col-xl-9 col-md-6 mb-4">
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                      <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                    </AreaChart>
                  </ResponsiveContainer>                   
                </div>    
                <div class="col-xl-3 col-md-6 mb-4">
                  <PieChart width={400} height={400}>
                    <Pie
                      data={datapiechart}
                      cx={200}
                      cy={200}
                      labelLine={false}
                      label={(entry) => entry.name}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend align="center" layout="horizontal" verticalAlign="bottom" />
                  </PieChart>
                </div>                      
            </div>            
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
