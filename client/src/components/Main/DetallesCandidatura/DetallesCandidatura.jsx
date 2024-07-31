import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPencil, FaX } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import GraficaCandidatura from "./GraficaCandidatura/GraficaCandidatura";

const statusOptions = [
  "Registro",
  "Solicitud",
  "Entrevista1",
  "Entrevista2",
  "CentroEvaluación",
  "Ofertado",
  "Abandona",
  "Descartado",
];

const DetallesCandidatura = () => {
  const [detallesCandidatura, setDetallesCandidatura] = useState(null);
  const [editIndex, setEditIndex] = useState(-1);
  //const [newNota, setNewNota] = useState('');
  // const [editCompetencia, setEditCompetencia] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [statusClass, setStatusClass] = useState('');
  //const [newStatus, setNewStatus] = useState('');
  const [editEmpleado, setEditEmpleado] = useState(false);
  //const [newEmpleado, setNewEmpleado] = useState('');
  const { id_candidatura } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id_candidaturaFromQuery = searchParams.get("id_candidatura");
  const navigate = useNavigate();

  const candidaturaId = id_candidatura || id_candidaturaFromQuery;

  const URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    async function fetchData() {
      if (!candidaturaId) {
        console.error('No se ha provisto de un id_candidatura');
        return;
      }

      try {
        const res = await axios.get(
          `${URL}/api/candidaturas?id_candidatura=${candidaturaId}`
        );
        const json = res.data;
        console.log(json);
        setDetallesCandidatura(json);
        if (res.data) {
          try {
            const res2 = await axios.get(`https://api-empleados-2nuf.onrender.com/predict?id_candidatura=${candidaturaId}`);
            const prediction = res2.data;
            console.log(prediction);

            if (prediction.prediction === 'Admitido') {
              setStatusClass('active');
            }

          } catch (error) {
            console.error(error);
            statusClass('');
            setDetallesCandidatura(null);
          }
        }
      } catch (e) {
        console.error(e);
        setDetallesCandidatura(null);
      }
    }

    fetchData();
  }, [candidaturaId]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleBorrarCandidatura = async () => {
    setLoading(true);
    try {
      await axios.delete(`${URL}/api/candidaturas?id_candidatura=${candidaturaId}`);
      navigate('/candidaturas');
    } catch (e) {
      console.error("Error al borrar candidatura:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDialog = () => {
    setShowDialog(true);
  };

  const handleHideDialog = () => {
    setShowDialog(false);
  };

  const handleStatusEditClick = (currentStatus) => {
    setEditStatus(true);
    setValue("status", currentStatus);
  };

  const handleEmpleadoEditClick = (currentEmpleado) => {
    setEditEmpleado(true);
    setValue("id_empleado", currentEmpleado);
  };

  /*const handleEditClick = (index, nota, nombre_competencia) => {
    setEditIndex(index);
    setNewNota(nota);
    setEditCompetencia(nombre_competencia);
  };*/

  /*const handleSubmitEditCompetencias = async (e, index) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(`${URL}/api/competencias`, {
        id_candidatura: candidaturaId,
        nombre_competencia: editCompetencia,
        nota: newNota,
      });

      setDetallesCandidatura(prevState => {
        const updatedState = [...prevState];
        updatedState[index] = {
          ...updatedState[index],
          nota: newNota
        };
        return updatedState;
      });
      setEditIndex(-1);
      setNewNota('');
      setEditCompetencia('');

    } catch (e) {
      console.error("Error updating competencia:", e);
    } finally {
      setLoading(false);
    }
  };*/

  const onSubmitEditCompetencias = async (data) => {
    setLoading(true);
    try {
      await axios.put(`${URL}/api/competencias`, {
        id_candidatura: candidaturaId,
        nombre_competencia: data.nombre_competencia,
        nota: data.nota,
      });

      setDetallesCandidatura(prevState => {
        const updatedState = [...prevState];
        const index = prevState.findIndex(item => item.nombre_competencia === data.nombre_competencia);
        if (index !== -1) {
          updatedState[index] = {
            ...updatedState[index],
            nota: data.nota
          };
        }
        return updatedState;
      });
      reset({ nota: '', nombre_competencia: '' });
      setEditIndex(-1);
    } catch (e) {
      console.error("Error updating competencia:", e);
    } finally {
      setLoading(false);
    }
  };

  /*const handleSubmitEditStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${URL}/api/candidaturas`, {
        id_candidatura: candidaturaId,
        status: newStatus,
      });

      setDetallesCandidatura(prevState => {
        const updatedState = [...prevState];
        updatedState[0] = {
          ...updatedState[0],
          status: newStatus
        };
        return updatedState;
      });
      setEditStatus(false);

    } catch (e) {
      console.error("Error updating status:", e);
    } finally {
      setLoading(false);
    }
  };*/

  const onSubmitEditStatus = async (data) => {
    setLoading(true);
    try {
      await axios.put(`${URL}/api/candidaturas`, {
        id_candidatura: candidaturaId,
        status: data.status,
      });

      setDetallesCandidatura(prevState => {
        return [{
          ...prevState[0],
          status: data.status
        }];
      });
      setEditStatus(false);
    } catch (e) {
      console.error("Error updating status:", e);
    } finally {
      setLoading(false);
    }
  };

  /*const handleSubmitEditEmpleado = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${URL}/api/candidaturas`, {
        id_candidatura: candidaturaId,
        id_empleado: newEmpleado,
      });

      setDetallesCandidatura(prevState => {
        const updatedState = [...prevState];
        updatedState[0] = {
          ...updatedState[0],
          id_empleado: newEmpleado
        };
        return updatedState;
      });
      setEditEmpleado(false);

    } catch (e) {
      console.error("Error updating empleado:", e);
    } finally {
      setLoading(false);
    }
  };*/

  const onSubmitEditEmpleado = async (data) => {
    setLoading(true);
    try {
      await axios.put(`${URL}/api/candidaturas`, {
        id_candidatura: candidaturaId,
        id_empleado: data.id_empleado,
      });

      setDetallesCandidatura(prevState => {
        return [{
          ...prevState[0],
          id_empleado: data.id_empleado
        }];
      });
      setEditEmpleado(false);
    } catch (e) {
      console.error("Error updating empleado:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!detallesCandidatura || detallesCandidatura.length === 0) {
    return <div>Loading...</div>;
  }

  const firstCandidatura = detallesCandidatura[0];

  if (!firstCandidatura) {
    return <div>No se encontraron datos para esta candidatura.</div>;
  }

  const {
    id_candidato,
    nombre_candidato,
    apellidos_candidato,
    email_candidato,
    telefono_candidato,
    edad,
    carrera,
    nivel_ingles,
    cv,
    id_empleado,
    status,
    fecha_registro,
    nombre_empleado,
    apellidos_empleado,
    email_empleado
  } = firstCandidatura;

  const fecha_registro_formatted = formatDate(fecha_registro);
  return (
    <>
      <section className={`container-detalles ${statusClass}`}>
        <div className="message-prediction">
          {statusClass === "active" ? "Candidato óptimo" : ""}
        </div>
        <article className="detalles-candidatura">
          <div className="detalles-candidato">
            <div className="idCandidato">
              <h2>ID Candidato: {id_candidato}</h2>
            </div>
            <div className="titulos-candidato">
              <div className="titulos-maximos">
                <h3>Nombre</h3>
                <h3>Apellidos</h3>
                <h3>Email</h3>
                <h3>Teléfono</h3>
                <h3>Edad</h3>
                <h3>Carrera</h3>
                <h3>Nivel de Inglés</h3>
                <h3>CV</h3>
              </div>

              <div className="parrafos-maximos">
                <p>{nombre_candidato}</p>
                <p>{apellidos_candidato}</p>
                <p>{email_candidato}</p>
                <p>{telefono_candidato}</p>
                <p>{edad}</p>
                <p>{carrera}</p>
                <p>{nivel_ingles}</p>
                <p>
                  <a href={cv} target="_blank">
                    <BsFileEarmarkPdfFill className="icon-pdf" />
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="competencias">
            <h3>Competencias</h3>
            <ul>
              {detallesCandidatura.map((item, index) => (
                <li key={index}>
                  {item.nombre_competencia}:{" "}
                  {editIndex === index ? (
                    <form onSubmit={handleSubmit(onSubmitEditCompetencias)}>
                      <input
                        type="text"
                        {...register("nombre_competencia", { required: true })}
                        defaultValue={item.nombre_competencia}
                        readOnly
                      />
                      <input
                        type="number"
                        {...register("nota", {
                          required: true,
                          min: { value: 0, message: "Debe ser mayor de 0" },
                          max: { value: 5, message: "Debe ser menor de 5" },
                        })}
                        defaultValue={item.nota}
                      />
                      <button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Guardar"}
                      </button>
                    </form>
                  ) : (
                    <>
                    
                      {item.nota}
                      <div className="lapiz" onClick={() => {
                          setEditIndex(index);
                          setValue(
                            "nombre_competencia",
                            item.nombre_competencia
                          );
                          setValue("nota", item.nota);
                        }}>
                        <p>Editar</p>
                      <FaPencil/>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="detalles-candidatura">
            <div className="idCandidato">
            <h2>ID Candidatura: {candidaturaId}</h2>
            </div>
            <h3>
              ID Empleado:{" "}
              {editEmpleado ? (
                <form onSubmit={handleSubmit(onSubmitEditEmpleado)}>
                  <input
                    type="number"
                    {...register("id_empleado", {
                      required: true,
                      min: { value: 0, message: "Debe ser mayor de 0" },
                    })}
                    defaultValue={id_empleado}
                  />
                  <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Guardar"}
                  </button>
                </form>
              ) : (
                <>
                  {id_empleado}
                  <FaPencil
                    onClick={() => handleEmpleadoEditClick(id_empleado)}
                  />
                </>
              )}
            </h3>
            <h3>Nombre Empleado: {nombre_empleado} {apellidos_empleado}</h3>
            <h3>Email Empleado: {email_empleado}</h3>
            <h3>
              Status:{" "}
              {editStatus ? (
                <form onSubmit={handleSubmit(onSubmitEditStatus)}>
                  <select
                    {...register("status", { required: true })}
                    defaultValue={status}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Guardar"}
                  </button>
                </form>
              ) : (
                <>
                  {status}
                  <FaPencil onClick={() => handleStatusEditClick(status)} />
                </>
              )}
            </h3>
            <h3>Fecha Registro: {fecha_registro_formatted}</h3>
          </div>
          <div className="btnsContainer">
            <button className="candidaturaBtn" onClick={handleShowDialog}>
              Eliminar candidatura
            </button>
          </div>

          {showDialog && (
            <div className="confirmation-dialog">
              <p>¿Estás seguro de que deseas eliminar esta candidatura?</p>
              <button onClick={handleBorrarCandidatura} disabled={loading}>
                {loading ? "Eliminando..." : "Sí, eliminar"}
              </button>
              <button onClick={handleHideDialog}>Cancelar</button>
            </div>
          )}
        </article>
      </section>
      <GraficaCandidatura competencias={detallesCandidatura} />
    </>
  );
};

export default DetallesCandidatura;
