import React, { useEffect, useRef, useState } from 'react'
import Footer from '../components/Footer'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import { Link } from 'react-router-dom'
import SkeletonTable from '../components/SkeletonTable'
import Swal from 'sweetalert2'
import axiosClient from '../axios-client'
import { Modal } from 'react-bootstrap'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import '../assets/css/custom_radio.css'

export default function Question() {

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

  const [questions, setQuestions] = useState([]);

  const [questionnaires, setQuestionnaires] = useState([]);

  const [listquestionnaires, setListQuestionnaires] = useState([]);

  const [filteredQuestions, setFilteredQuestions] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);

  const [showModalQuestionnaire, setShowModalQuestionnaire] = useState(false);

  const [showModalQuestion, setShowModalQuestion] = useState(false);

  const [showModalQuestionQname, setShowModalQuestionQname] = useState(false);

  const [showModalQuestionTab, setShowModalQuestionTab] = useState({});

  const [dataquestion,setDataQuestion] = useState({});

  const [dataquestionresponse,setDataQuestionResponse] = useState(0);

  const [dataquestionnaire,setDataQuestionnaire] = useState({});

  const [showUpdate, setShowUpdate] = useState(false);

  const [selectedQuestionId,setSelectedQuestionId] = useState(null);

  const inputs = useRef([]);

  const [validationerror , setValidationError] = useState("");
  
  const [loadingsubmitbutton, setLoadingSubmitButton] = useState(false);

  const [loadingsubmitquestionnaire, setLoadingSubmitQuestionnaire] = useState(false);

  const [success,setSucces] = useState("");

  const [successquestionnaire,setSuccesQuestionnaire] = useState("");

  const [QuestionnaireName, setInputQuestionnaireName] = useState('');

  const handleChangeQuestionnaireName = (event) => {
    setInputQuestionnaireName(event.target.value);
  };

  const formRef = useRef();

  useEffect(() => {
    const filtered = questions.filter((question) =>{
      const searchString = `${question.question_description.toLowerCase()} ${question.question_response.toLowerCase()} ${question.questionnaire.questionnaire_name.toLowerCase()}`;
      return searchString.includes(searchTerm.toLowerCase());
    });
    setFilteredQuestions(filtered);
  }, [questions, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    getQuestions() && getQuestionnairesForQuestion() && getQuestionnaires();
  }, []);

  const getQuestions = async () => {
    setLoadingSkeletonButton(true);
    axiosClient.get('/questions').then( ({data})=> {
      setQuestions(data.data);
      setLoadingSkeletonButton(false);
    }).catch(err => {
      setLoadingSkeletonButton(false);
    });
  };

  const getQuestionnairesForQuestion = async () => {
    setLoadingSkeletonButton(true);
    axiosClient.get('/questionnaires').then( ({data})=> {
      setQuestionnaires(data.data);
      setLoadingSkeletonButton(false);
    }).catch(err => {
      console.log(err);
      setLoadingSkeletonButton(false);
    });
  };

  const getQuestionnaires = async () => {
    axiosClient.get('/questionnaires').then( ({data})=> {
      setListQuestionnaires(data.data);
    }).catch(err => {
      console.log(err);
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedQuestionId(null);
    setShowUpdate(false);
    setDataQuestion({});
    setDataQuestionnaire({});
    setEditorDescription("");
    setDataQuestionResponse(0);
    inputs.current = [];
  };

  const handleModalCloseQuestionnaire = () => {
    setShowModalQuestionnaire(false);
    inputs.current = [];
  };  

  const handleModalCloseQuestion = () => {
    setShowModalQuestion(false);
    inputs.current = [];
  };   

  const handleModalOpen = async (question_id) => {
    if (question_id != "") {
      axiosClient.get(`/questions/${question_id}`).then(({data}) => {
        let list = data.data;
        setDataQuestion(list);
        setDataQuestionnaire(list.questionnaire);
        setEditorDescription(list.question_description);
        setShowUpdate(true);
        if (list.question_choice_one == list.question_response) {
          setDataQuestionResponse(1);
        }else if (list.question_choice_two == list.question_response) {
          setDataQuestionResponse(2);
        }else if (list.question_choice_three == list.question_response) {
          setDataQuestionResponse(3);
        }else if (list.question_choice_four == list.question_response) {
          setDataQuestionResponse(4);
        }
        setSelectedQuestionId(list.question_id);
      });
    }
    inputs.current = [];
    setShowModal(true);
  }

  const handleModalOpenQuestionnaire = async () => {
    setShowModalQuestionnaire(true);
  }

  const handleModalOpenQuestion = async (questionnaire_name,question_id) => {
    setShowModalQuestionQname(questionnaire_name);
    if (question_id != "") {
      axiosClient.get(`/questions/${question_id}`).then(({data}) => {
        let list = data.data;
        setShowModalQuestionTab(list);
      });
    }
    setShowModalQuestion(true);
  }

  const addInputs = el => {
    if (el && !inputs.current.includes(el)) {
      inputs.current.push(el)
    }
  }

  const [editorDescription, setEditorDescription] = useState('');

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image',
  ];

  const handleEditorDescription = (html) => {
    setEditorDescription(html);
  };


  const AddAndUpdateQuestion = async (event) =>{
    event.preventDefault();
    const errors = {};

    if (!editorDescription || editorDescription == '<p><br></p>') {
      errors.question_description = 'le descriptif es requis.';
    }

    if (inputs.current[0].value.trim() === '') {
      errors.question_choice_one = 'le champ choix 1 est requis';
    }

    if (inputs.current[1].value.trim() === '') {
      errors.question_choice_two = 'le champ choix 2 est requis';
    }

    if (inputs.current[2].value.trim() === '') {
      errors.question_choice_three = 'le champ choix 3 est requis';
    }
    
    if (inputs.current[3].value.trim() === '') {
      errors.question_choice_four = 'le champ choix 4 est requis';
    }    

    if (inputs.current[4].value.trim() === '') {
      errors.question_response = 'Choisissez une reponse';
    }

    if (inputs.current[5].value.trim() === '') {
      errors.questionnaire_id = 'Choisissez une questionnaire';
    }

    if (Object.keys(errors).length === 0) {
      setLoadingSubmitButton(true);

      let reponse = "";
      if (inputs.current[4].value.trim() == "1") {
        reponse = inputs.current[0].value.trim();
      }else if (inputs.current[4].value.trim() == "2") {
        reponse = inputs.current[1].value.trim();
      }else if (inputs.current[4].value.trim() == "3") {
        reponse = inputs.current[2].value.trim();
      }else if (inputs.current[4].value.trim() == "4") {
        reponse = inputs.current[3].value.trim();
      }

      if (selectedQuestionId) {
        const dataquestion = {_method : 'PUT' ,description : editorDescription, choice_one: inputs.current[0].value.trim(), choice_two: inputs.current[1].value.trim(), choice_three: inputs.current[2].value.trim(), choice_four: inputs.current[3].value.trim(), response : reponse , questionnaire_id : parseInt(inputs.current[5].value.trim())}
        await axiosClient.post(`/questions/${selectedQuestionId}`,dataquestion).then(({data})  => {
          setSucces("Question modifiée avec succès");
          setTimeout(() => { setSucces('');}, 3000);
          Swal.fire({position: 'Center',icon: 'success',title: 'Success',text: 'Question modifiée avec succès.',showConfirmButton: true});
          setLoadingSubmitButton(false);
          getQuestions();
        }).catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            if (response.data.errors.questionnaire_id) {
              errors.questionnaire_id = response.data.errors.questionnaire_id;
            }                  
          }
        });
      }else{
        const dataquestion = {description : editorDescription, choice_one: inputs.current[0].value.trim(), choice_two: inputs.current[1].value.trim(), choice_three: inputs.current[2].value.trim(), choice_four: inputs.current[3].value.trim(), response : reponse , questionnaire_id : parseInt(inputs.current[5].value.trim()) , state: "asset"}
        await axiosClient.post('/questions', dataquestion).then(({data})  => {
          setSucces("Question ajoutée avec succès");
          setTimeout(() => { setSucces('');}, 3000);
          Swal.fire({position: 'Center',icon: 'success',title: 'Success',text: 'Question ajoutée avec succès.',showConfirmButton: true});
          formRef.current.reset();
          setEditorDescription("");
          setLoadingSubmitButton(false);
          getQuestions();
        }).catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            if (response.data.errors.questionnaire_id) {
              errors.questionnaire_id = response.data.errors.questionnaire_id;
            }                  
          }
        });
      }

      setValidationError(errors);
    } else {
      setValidationError(errors);
    }
    setLoadingSubmitButton(false);
  }  

  const AddQuestionnaire = async (event) =>{
    event.preventDefault();
    const errors = {};

    if (!QuestionnaireName || QuestionnaireName == '') {
      errors.questionnaire_name = 'entrez le nom du questionnaire.';
    }

    if (Object.keys(errors).length === 0) {
      setLoadingSubmitQuestionnaire(true);
      const dataquestionnaire = {name : QuestionnaireName, state : "asset"};
      await axiosClient.post(`/questionnaires`,dataquestionnaire).then(({data})  => {
        setSuccesQuestionnaire("Questionnaire ajouté avec succès");
        setTimeout(() => { setSuccesQuestionnaire('');}, 4000);
        setLoadingSubmitQuestionnaire(false);
        setInputQuestionnaireName('');
        getQuestionnaires();
      })
      setValidationError(errors);
    } else {
      setValidationError(errors);
    }
    setLoadingSubmitQuestionnaire(false);
  }    

  const ChangeStateQuestion  = async(id,question_state) => {
    Swal.fire({
      title: 'Choisir une operation', icon: 'question',showDenyButton: true,showCancelButton: true, confirmButtonColor: '#61396d',confirmButtonText: 'Activer',denyButtonText: `Desactiver`, cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if(question_state !== "asset")
        {
          let state = "asset";
          const formData = new FormData();
          formData.append('_method', 'PUT');
          setLoadingButton(true);
          await axiosClient.post(`/setstatequestion/${id}/${state}`,formData).then(async ({data})  => {
            getQuestions();
            Swal.fire({position: 'top-right',icon: 'success',title: 'Thanks you!',text: 'Cette question a été activé avec succès',showConfirmButton: true})
          }).catch(err => {
            const response = err.response;
            if (response && response.status === 422) {
              Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: 'Une erreur s\'est produite lors de l\'exécution du programme',showConfirmButton: true,confirmButtonColor: '#61396d',})
            }
          });
          setLoadingButton(false);
        }
        else{
          Swal.fire({position: 'top-right',icon: 'warning',title: 'Information',text: 'Cette question est deja activée',showConfirmButton: true,confirmButtonColor: '#61396d',})
        }
      }
      else if (result.isDenied) {
        if(question_state !== "idle")
        {
          let state = "idle";
          const formData = new FormData();
          formData.append('_method', 'PUT');
          setLoadingButton(true);
          await axiosClient.post(`/setstatequestion/${id}/${state}`,formData).then(async ({data})  => {
            getQuestions();
            Swal.fire({position: 'top-right',icon: 'success',title: 'Thanks you!',text: 'Cette question a été desactivé avec succès',showConfirmButton: true})
          }).catch(err => {
            const response = err.response;
            if (response && response.status === 422) {
              Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: 'Une erreur s\'est produite lors de l\'exécution du programme',showConfirmButton: true,confirmButtonColor: '#61396d',})
            }
          });
          setLoadingButton(false);
        }
        else{
          Swal.fire({position: 'top-right',icon: 'warning',title: 'Information',text: 'Cette question est deja deactivée',showConfirmButton: true,confirmButtonColor: '#61396d',})
        }
      }
    });
  };

  const ChangeStateQuestionnaire  = async(id,questionnaire_state) => {
    Swal.fire({
      title: 'Choisir une operation', icon: 'question',showDenyButton: true,showCancelButton: true, confirmButtonColor: '#61396d',confirmButtonText: 'Activer',denyButtonText: `Desactiver`, cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if(questionnaire_state !== "asset")
        {
          let state = "asset";
          const formData = new FormData();
          formData.append('_method', 'PUT');
          setLoadingButton(true);
          await axiosClient.post(`/setstatequestionnaire/${id}/${state}`,formData).then(async ({data})  => {
            getQuestionnaires();
            Swal.fire({position: 'top-right',icon: 'success',title: 'Thanks you!',text: 'Ce questionnaire a été activé avec succès',showConfirmButton: true})
          }).catch(err => {
            const response = err.response;
            if (response && response.status === 422) {
              Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: 'Une erreur s\'est produite lors de l\'exécution du programme',showConfirmButton: true,confirmButtonColor: '#61396d',})
            }
          });
          setLoadingButton(false);
        }
        else{
          Swal.fire({position: 'top-right',icon: 'warning',title: 'Information',text: 'Ce questionnaire est deja activé',showConfirmButton: true,confirmButtonColor: '#61396d',})
        }
      }
      else if (result.isDenied) {
        if(questionnaire_state !== "idle")
        {
          let state = "idle";
          const formData = new FormData();
          formData.append('_method', 'PUT');
          setLoadingButton(true);
          await axiosClient.post(`/setstatequestionnaire/${id}/${state}`,formData).then(async ({data})  => {
            getQuestionnaires();
            Swal.fire({position: 'top-right',icon: 'success',title: 'Thanks you!',text: 'Ce questionnaire a été desactivé avec succès',showConfirmButton: true})
          }).catch(err => {
            const response = err.response;
            if (response && response.status === 422) {
              Swal.fire({position: 'top-right',icon: 'error',title: 'Oops!',text: 'Une erreur s\'est produite lors de l\'exécution du programme',showConfirmButton: true,confirmButtonColor: '#61396d',})
            }
          });
          setLoadingButton(false);
        }
        else{
          Swal.fire({position: 'top-right',icon: 'warning',title: 'Information',text: 'Ce questionnaire est deja deactivé',showConfirmButton: true,confirmButtonColor: '#61396d',})
        }
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
                    <h5 class="m-0 font-weight-bold text-primary">
                        Toutes les questions
                    </h5>
                    <h6 class="m-0 font-weight-bold text-primary float-right">
                        <Link onClick={() => handleModalOpenQuestionnaire("")} class="btn btn-primary" style={{ borderRadius : "6px" }}>Questionnaires<i class="fas fa-fw fa-plus"></i> </Link>
                        <Link onClick={() => handleModalOpen("")} title="Ajouter une question" class="btn btn-primary" style={{ borderRadius : "6px", marginLeft : "10px" }}><i class="fas fa-fw fa-plus"></i> </Link>
                    </h6>
                </div>             
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Description</th>
                                <th>Questionnaire</th>
                                <th>Statut</th>                            
                                <th>Reponse</th>
                                <th>Action 1</th>
                                <th>Action 2</th>
                                <th>Action 3</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingskeletonbutton ? <>{SkeletonTable(7,8)}</>:
                                <>
                                    {filteredQuestions && filteredQuestions.map((question,index) => {
                                        let classState = "";
                                        let contentState = "";
                                        if (question.question_state === "asset") {classState = "bg-primary text-white";contentState = "activée";} 
                                        else if (question.question_state === "idle") { classState = "bg-danger text-white";contentState = "desactivée";}
                                        else{ classState = "bg-warning text-white";contentState = "en Attente";}
                                        const descendingIndex = questions.length - index;
                                        let questionReponse = question.question_response;
                                        if (questionReponse.length > 25) {
                                          questionReponse = questionReponse.substr(0,20)+"..";
                                        }
                                        let questionDescription = question.question_description;
                                        if (questionDescription.length > 35) {
                                          questionDescription = questionDescription.substr(0,30)+"..";
                                        }

                                        let questionnaireName = question.questionnaire.questionnaire_name;
                                        return (
                                          <tr>
                                            <td style={{ fontSize : "16px" }}> { descendingIndex } </td>
                                            <td style={{ fontSize : "16px", cursor : "pointer" }}>
                                              <div dangerouslySetInnerHTML={{ __html: questionDescription }} />
                                            </td>
                                            <td style={{ fontSize : "16px" }}> { questionnaireName } </td>
                                            <td style={{ fontSize : "16px" }}>
                                              <button class={`btn btn-circle ${classState}`} style={{ borderRadius : "50%",width: "90px", height : "40px", padding : "10px"}}>
                                                  {contentState}
                                              </button>
                                            </td>
                                            <td title={question.question_response} style={{ fontSize : "16px" }}> { questionReponse } </td>
                                            <td>
                                              <a onClick={() => ChangeStateQuestion(question.question_id,question.question_state)} class="btn btn-sm btn-secondary" style={{ textDecoration : "none", backgroundColor : "#eeeeee",padding : "5px" }}><span class="text-success">act</span><span class="text-dark">/</span><span class="text-danger">dst</span> {loadingbutton ? <i class="fa fa-refresh fa-spin" style={{ color : "black" }}></i> : null} </a>
                                            </td>   
                                            <td>
                                                <a onClick={() => handleModalOpen(question.question_id)} class="btn btn-sm btn-primary" style={{ textDecoration : "none", padding : "5px" }}>Modifier</a>
                                            </td>  
                                            <td>
                                                <a onClick={() => handleModalOpenQuestion(questionnaireName,question.question_id)} class="btn btn-sm btn-secondary" style={{ textDecoration : "none", padding : "5px" }}>Aperçu</a>
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
                      {showUpdate ? "Modifier une question" : "Ajouter une question"}
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
                      <div class="col-12">
                        <label> Description : *</label>
                        <ReactQuill value={editorDescription} onChange={handleEditorDescription} modules={modules} formats={formats} style={{ fontSize : "20px" }}/>
                        {validationerror.question_description && <span className="text-danger">{validationerror.question_description}</span>}
                      </div><br/>
                      <div class="col-12">
                        <label> Choix 1 : *</label>
                        <input
                          type="text"
                          className='form-control'
                          ref={addInputs}
                          defaultValue={showUpdate ? dataquestion.question_choice_one : ""}
                        />
                        {validationerror.question_choice_one && <span className="text-danger">{validationerror.question_choice_one}</span>}
                      </div><br/>          
                      <div class="col-12">
                        <label> Choix 2 : *</label>
                        <input
                          type="text"
                          className='form-control'
                          ref={addInputs}
                          defaultValue={showUpdate ? dataquestion.question_choice_two : ""}
                        />
                        {validationerror.question_choice_two && <span className="text-danger">{validationerror.question_choice_two}</span>}
                      </div><br/>
                      <div class="col-12">
                        <label> Choix 3 : *</label>
                        <input
                          type="text"
                          className='form-control'
                          ref={addInputs}
                          defaultValue={showUpdate ? dataquestion.question_choice_three : ""}
                        />
                        {validationerror.question_choice_three && <span className="text-danger">{validationerror.question_choice_three}</span>}
                      </div><br/>
                      <div class="col-12">
                        <label> Choix 4 : *</label>
                        <input
                          type="text"
                          className='form-control'
                          ref={addInputs}
                          defaultValue={showUpdate ? dataquestion.question_choice_four : ""}
                        />
                        {validationerror.question_choice_four && <span className="text-danger">{validationerror.question_choice_four}</span>}
                      </div><br/>
                      
                      <div class="col-12">
                        <label> Reponse : *</label>
                        <select ref={addInputs} id="" className='form-control' style={{ padding : "7px", borderRadius : "3px", border: "1px solid #eeeeee", outline : "none" }}>
                            <option selected={dataquestionresponse == 0 ? 'selected' : ''} ></option>
                            <option selected={dataquestionresponse == 1 ? 'selected' : ''} value="1">1er choix</option>
                            <option selected={dataquestionresponse == 2 ? 'selected' : ''} value="2">2e choix</option>
                            <option selected={dataquestionresponse == 3 ? 'selected' : ''} value="3">3e choix</option>
                            <option selected={dataquestionresponse == 3 ? 'selected' : ''} value="4">4e choix</option>
                        </select>
                        {validationerror.question_response && <span className="text-danger">{validationerror.question_response}</span>}
                      </div><br/>

                      <div class="col-12">
                        <label> Questionnaire : *</label>
                        <select ref={addInputs} id="" className='form-control' style={{ padding : "7px", borderRadius : "3px", border: "1px solid #eeeeee", outline : "none" }}>
                            <option></option>
                            {questionnaires && questionnaires.map((questionnaire) => {
                              return (
                                <>
                                  { questionnaire.questionnaire_state  == "asset" ?
                                    <option selected={dataquestionnaire.questionnaire_id == questionnaire.questionnaire_id ? 'selected' : ''} value={questionnaire.questionnaire_id}>{questionnaire.questionnaire_name}</option>
                                  : null } 
                                </>
                              );
                            })} 
                        </select>
                        {validationerror.questionnaire_id && <span className="text-danger">{validationerror.questionnaire_id}</span>}
                      </div><br/>

                      <div class="col-12">
                        <button class="btn btn-primary text-white" style={{borderRadius: "5px",padding: "5px", float : "right"}} onClick={loadingsubmitbutton ? null : AddAndUpdateQuestion}>
                          {loadingsubmitbutton ? <i class="fa fa-refresh fa-spin"></i> : null} {showUpdate ? "Modifier" : "Valider"}
                        </button>
                      </div><br/>     
                    </form>
                  </Modal.Body>
                </Modal>
                <Modal show={showModalQuestionnaire} onHide={handleModalCloseQuestionnaire}>
                  <Modal.Header>
                    <Modal.Title>
                      Ajouter un Questionnaire
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <form ref={formRef}>
                      {successquestionnaire ? <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <>{ successquestionnaire }
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
                      <div class="col-12">
                        <label> Nom : *</label>
                        <input
                          type="text"
                          className='form-control'
                          value={QuestionnaireName} onChange={handleChangeQuestionnaireName}
                        />
                        {validationerror.questionnaire_name && <span className="text-danger">{validationerror.questionnaire_name}</span>}
                      </div><br/>
                      <div class="col-12">
                        <button class="btn btn-primary text-white" style={{borderRadius: "5px",padding: "5px", float : "right"}} onClick={loadingsubmitquestionnaire ? null : AddQuestionnaire}>
                          {loadingsubmitquestionnaire ? <i class="fa fa-refresh fa-spin"></i> : null} Valider
                        </button>
                      </div><br/>
                    </form>
                    <div class="card-body">
                      <div class="table-responsive">
                          <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                          <thead>
                              <tr>
                                  <th>Nom</th>
                                  <th>Statut</th>    
                                  <th>Action</th>
                              </tr>
                          </thead>
                          <tbody>
                            {listquestionnaires && listquestionnaires.map((questionnaire,index) => {
                                let classState = "";
                                let contentState = "";
                                if (questionnaire.questionnaire_state === "asset") {classState = "text-primary text-white";contentState = "activée";} 
                                else if (questionnaire.questionnaire_state === "idle") { classState = "text-danger text-white";contentState = "desactivée";}
                                else{ classState = "text-warning text-white";contentState = "en Attente";}
                                return (
                                  <tr>
                                    <td style={{ fontSize : "16px" }}> { questionnaire.questionnaire_name } </td>
                                    <td style={{ fontSize : "16px" }} class={`text ${classState}`}>
                                      {contentState}
                                    </td> 
                                    <td>
                                      <a onClick={() => ChangeStateQuestionnaire(questionnaire.questionnaire_id,questionnaire.questionnaire_state)} class="btn btn-sm btn-secondary" style={{ textDecoration : "none", backgroundColor : "#eeeeee",padding : "5px" }}><span class="text-success">act</span><span class="text-dark">/</span><span class="text-danger">dst</span> {loadingbutton ? <i class="fa fa-refresh fa-spin" style={{ color : "black" }}></i> : null} </a>
                                    </td>                                                                                                                                                                 
                                  </tr> 
                                );
                            })} 
                                  
                          </tbody>
                          </table>
                      </div>
                  </div>
                  </Modal.Body>
                </Modal>
                <Modal show={showModalQuestion} onHide={handleModalCloseQuestion}>
                  <Modal.Header>
                    <Modal.Title>
                      {showModalQuestionQname}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className='row'>
                      <div className='col-12' style={{ fontSize : "20px" }} dangerouslySetInnerHTML={{ __html: showModalQuestionTab.question_description }}>
                      </div>
                    </div><br/>
                    <div className='row'>
                        <form>
                          <div className='col-12'>                            
                            <label class="containercustomradio">{showModalQuestionTab.question_choice_one}
                              <input type="radio" checked={showModalQuestionTab.question_choice_one == showModalQuestionTab.question_response ? 'checked' : ''} name="radio"/>
                              <span class="checkmark"></span>
                            </label>
                          </div>
                          <div className='col-12'>           
                            <label class="containercustomradio">{showModalQuestionTab.question_choice_two}
                              <input type="radio" checked={showModalQuestionTab.question_choice_two == showModalQuestionTab.question_response ? 'checked' : ''} name="radio"/>
                              <span class="checkmark"></span>
                            </label>                                     
                          </div> 
                          <div className='col-12'>  
                            <label class="containercustomradio">{showModalQuestionTab.question_choice_three}
                              <input type="radio" checked={showModalQuestionTab.question_choice_three == showModalQuestionTab.question_response ? 'checked' : ''} name="radio"/>
                              <span class="checkmark"></span>
                            </label>                                                   
                          </div>   
                          <div className='col-12'>      
                            <label class="containercustomradio">{showModalQuestionTab.question_choice_four}
                              <input type="radio" checked={showModalQuestionTab.question_choice_four == showModalQuestionTab.question_response ? 'checked' : ''} name="radio"/>
                              <span class="checkmark"></span>
                            </label>                                             
                          </div>                                                                                                                  
                        </form>
                    </div>                                  
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

