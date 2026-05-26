import React, { useState, useEffect } from 'react';
import axios from 'axios';
// IMPORTAMOS EL HOOK GLOBAL DE NOTIFICACIONES
import { useNotificacion } from '../../context/NotificacionContext';
import Button from '../../components/Common/Button';
import '../../styles/admin/Profesionales.css';

const Profesionales = () => {
  // Enganchamos nuestro "handie" de la central global de avisos
  const { mostrarAviso } = useNotificacion();

  const [profesionales, setProfesionales] = useState([]);
  const [areas, setAreas] = useState([]);
  const [todasEspecialidades, setTodasEspecialidades] = useState([]);
  const [especialidadesFiltradas, setEspecialidadesFiltradas] = useState([]);

  const [mostrarPerfilProfesional, setMostrarPerfilProfesional] = useState(false);
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  
  // Estado para controlar el filtro de activos / inhabilitados
  const [verInhabilitados, setVerInhabilitados] = useState(false);

  // Modificamos el modal para que sirva tanto para Dar de Baja como para Dar de Alta (Rehabilitar)
  const [modalConfirmar, setModalConfirmar] = useState({ abierto: false, id: null, nombre: '', accion: 'baja' });
  const [modalDetalle, setModalDetalle] = useState({ abierto: false, profesional: null });

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    rol: '',
    email: '', 
    telefono: '',
    matricula: '', 
    esProfesionalSalud: false,
    area: '',
    especialidades: [],
    activo: true
  });

  useEffect(() => {
    fetchProfesionales();
    fetchAreasYEspecialidades();
  }, []);

  useEffect(() => {
    if (formData.area) {
      const filtradas = todasEspecialidades.filter(esp => {
        if (!esp) return false;
        return esp.area === formData.area || esp.area?._id === formData.area;
      });
      setEspecialidadesFiltradas(filtradas);
    } else {
      setEspecialidadesFiltradas([]);
    }
  }, [formData.area, todasEspecialidades]);

  const fetchProfesionales = async () => {
    try {
      const res = await axios.get('https://centro-raices-fullstack.onrender.com/api/profesionales');
      setProfesionales(res.data || []);
    } catch (error) {
      mostrarAviso("Error de conexión al traer profesionales", "error");
    }
  };

  const fetchAreasYEspecialidades = async () => {
    try {
      const [resAreas, resEsps] = await Promise.all([
        axios.get('https://centro-raices-fullstack.onrender.com/api/areas'),
        axios.get('https://centro-raices-fullstack.onrender.com/api/especialidades')
      ]);
      setAreas(resAreas.data || []);
      setTodasEspecialidades(resEsps.data || []);
    } catch (error) {
      mostrarAviso("Error al cargar configuraciones de áreas", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'area') {
      setFormData({ ...formData, area: value, especialidades: [] });
      return;
    }
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleCheckboxEspecialidad = (idEsp) => {
    const { especialidades } = formData;
    if (especialidades.includes(idEsp)) {
      setFormData({ ...formData, especialidades: especialidades.filter(id => id !== idEsp) });
    } else {
      setFormData({ ...formData, especialidades: [...especialidades, idEsp] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let matriculaIngresada = (formData.matricula || '').trim().toUpperCase();
    matriculaIngresada = matriculaIngresada.replace(/^MN-/, '').replace(/^MN/, '');
    const matriculaFormateada = matriculaIngresada ? `MN-${matriculaIngresada}` : '';

    const datosAEnviar = {
      ...formData,
      nombre: (formData.nombre || '').trim().toUpperCase(),
      apellido: (formData.apellido || '').trim().toUpperCase(),
      rol: (formData.rol || '').trim() ? formData.rol.trim().toUpperCase() : 'PROFESIONAL',
      matricula: matriculaFormateada,
      dni: (formData.dni || '').trim(),
      correo: (formData.email || '').trim().toLowerCase(),
      esProfesionalSalud: mostrarPerfilProfesional,
      area: mostrarPerfilProfesional ? formData.area : undefined,
      especialidades: mostrarPerfilProfesional ? formData.especialidades : []
    };

    try {
      if (editando) {
        await axios.put(`https://centro-raices-fullstack.onrender.com/api/profesionales/${idEditar}`, datosAEnviar);
        mostrarAviso("¡Datos actualizados con éxito!", "exito");
      } else {
        await axios.post('https://centro-raices-fullstack.onrender.com/api/profesionales', datosAEnviar);
        mostrarAviso("¡Registro exitoso en el Staff!", "exito");
      }
      await fetchProfesionales();
      limpiarFormulario();
    } catch (error) {
      mostrarAviso(error.response?.data?.mensaje || "Error en la operación", "error");
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      nombre: '', apellido: '', dni: '', rol: '', email: '', telefono: '',
      matricula: '', area: '', especialidades: [], activo: true
    });
    setMostrarPerfilProfesional(false);
    setEditando(false);
    setIdEditar(null);
  };

  const prepararEdicion = (p) => {
    if (!p) return;
    setEditando(true);
    setIdEditar(p._id);
    setMostrarPerfilProfesional(!!p.esProfesionalSalud);

    const numeroMatriculaLimpio = p.matricula ? p.matricula.replace(/^MN-/, '').replace(/^MN/, '') : '';

    setFormData({
      ...p,
      nombre: p.nombre || '',
      apellido: p.apellido || '',
      dni: p.dni || '',
      email: p.correo || p.email || '', 
      rol: p.rol || 'PROFESIONAL',
      telefono: p.telefono || '',
      matricula: numeroMatriculaLimpio,
      area: p.area?._id || p.area || '',
      especialidades: p.especialidades ? p.especialidades.map(esp => esp._id || esp) : []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ejecutarCambioEstado = async () => {
    try {
      if (modalConfirmar.accion === 'baja') {
        await axios.put(`https://centro-raices-fullstack.onrender.com/api/profesionales/${modalConfirmar.id}`, { activo: false });
        mostrarAviso("Personal inhabilitado correctamente", "advertencia");
      } else {
        await axios.put(`https://centro-raices-fullstack.onrender.com/api/profesionales/${modalConfirmar.id}`, { activo: true });
        mostrarAviso("¡Personal dado de alta nuevamente!", "exito");
      }
      setModalConfirmar({ abierto: false, id: null, nombre: '', accion: 'baja' });
      setModalDetalle({ abierto: false, profesional: null }); // Cerramos detalles por consistencia
      await fetchProfesionales();
    } catch (error) {
      mostrarAviso("Hubo un error al procesar el cambio de estado", "error");
    }
  };

  // Filtrado controlado
  const profesionalesFiltrados = profesionales.filter(p => {
    if (!p) return false;
    return verInhabilitados ? p.activo === false : p.activo !== false;
  });

  return (
    <div className="profesionales-container">
      <h1 className="title-main">Staff Centro Raíces</h1>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-header-edit">
          <h3 className="form-subtitle">
            <i className={editando ? "fas fa-user-edit" : "fas fa-user-plus"}></i>
            {editando ? " Editando Personal" : " Nuevo Registro"}
          </h3>
        </div>

        <div className="form-grid">
          <input type="text" name="nombre" placeholder="Nombre *" value={formData.nombre} onChange={handleChange} required />
          <input type="text" name="apellido" placeholder="Apellido *" value={formData.apellido} onChange={handleChange} required />
          <input type="text" name="dni" placeholder="DNI *" value={formData.dni} onChange={handleChange} required />
          <input type="text" name="rol" placeholder="Rol / Función * (Ej: Tallerista, Recepción)" value={formData.rol} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleChange} required />
          <input type="text" name="telefono" placeholder="Celular" value={formData.telefono} onChange={handleChange} />
        </div>

        <div className="checkbox-section">
          <label className="switch">
            <input type="checkbox" checked={mostrarPerfilProfesional} onChange={(e) => setMostrarPerfilProfesional(e.target.checked)} />
            <span className="slider round"></span>
          </label>
          <span className="switch-text">¿Es Profesional matriculado?</span>
        </div>

        {mostrarPerfilProfesional && (
          <div className="perfil-profesional-block animacion-fade">
            <h3 className="section-title">Datos del Perfil</h3>
            <div className="form-grid" style={{ alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #ccc', borderRadius: '4px', paddingLeft: '10px' }}>
                <span style={{ color: '#555', fontWeight: 'bold', marginRight: '5px', userSelect: 'none' }}>MN-</span>
                <input
                  type="text"
                  name="matricula"
                  placeholder="Solo números"
                  value={formData.matricula}
                  onChange={handleChange}
                  style={{ border: 'none', paddingLeft: '2px', width: '100%', outline: 'none' }}
                />
              </div>

              <select name="area" value={formData.area} onChange={handleChange} required={mostrarPerfilProfesional}>
                <option value="">Seleccione Área de Trabajo...</option>
                {areas.map(a => (
                  <option key={a._id} value={a._id}>{a.nombre}</option>
                ))}
              </select>
            </div>

            {formData.area && especialidadesFiltradas.length > 0 && (
              <div className="especialidades-checkbox-group animacion-fade" style={{ marginTop: '15px' }}>
                <h4 style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>Especialidades / Enfoques:</h4>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  {especialidadesFiltradas.map(esp => (
                    <label key={esp._id} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '14px' }}>
                      <input
                        type="checkbox"
                        checked={formData.especialidades.includes(esp._id)}
                        onChange={() => handleCheckboxEspecialidad(esp._id)}
                      />
                      {esp.nombre}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
          {editando && (
            <Button type="button" onClick={limpiarFormulario} variant="secondary">
              Cancelar
            </Button>
          )}
          <Button type="submit" variant="primary">
            <i className="fas fa-save"></i> {editando ? " Actualizar Staff" : " Guardar en Staff"}
          </Button>
        </div>
      </form>

      {/* SECCIÓN DEL FILTRO PARA LA DUEÑA */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px', alignItems: 'center', gap: '8px' }}>
        <label className="switch" style={{ transform: 'scale(0.85)' }}>
          <input type="checkbox" checked={verInhabilitados} onChange={(e) => setVerInhabilitados(e.target.checked)} />
          <span className="slider round" style={{ backgroundColor: verInhabilitados ? '#ffb300' : '#ccc' }}></span>
        </label>
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: verInhabilitados ? '#ffb300' : '#555' }}>
          {verInhabilitados ? "🕵️‍♂️ Viendo Personal Inhabilitado" : "👁️ Viendo Personal Activo"}
        </span>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Rol / Función</th>
              <th>Área de Trabajo</th>
              <th>Celular / Contacto</th>
              <th>Matrícula</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profesionalesFiltrados.map(p => (
              <tr key={p._id} style={{ opacity: p.activo === false ? 0.75 : 1 }}>
                <td>{p.apellido || ''}, {p.nombre || ''}</td>
                <td>{p.rol || '-'}</td>
                <td>
                  {p.esProfesionalSalud ? (
                    <strong style={{ color: p.activo === false ? '#777' : '#4A6741' }}>{p.area?.nombre || 'SIN ÁREA'}</strong>
                  ) : (
                    <span style={{ color: '#777', fontStyle: 'italic' }}>STAFF GENERAL</span>
                  )}
                </td>
                <td>{p.telefono || '-'}</td>
                <td>{p.matricula || '-'}</td>
                <td className="actions-cell">
                  <button className="btn-edit" style={{ marginRight: '5px' }} onClick={() => setModalDetalle({ abierto: true, profesional: p })} title="Ver Detalles">
                    <i className="fas fa-eye"></i>
                  </button>
                  
                  {p.activo !== false && (
                    <button className="btn-edit" style={{ marginRight: '5px' }} onClick={() => prepararEdicion(p)} title="Editar">
                      <i className="fas fa-pen"></i>
                    </button>
                  )}

                  {p.activo !== false ? (
                    <button className="btn-delete" onClick={() => setModalConfirmar({ abierto: true, id: p._id, nombre: `${p.nombre || ''} ${p.apellido || ''}`, accion: 'baja' })} title="Inhabilitar">
                      <i className="fas fa-trash"></i>
                    </button>
                  ) : (
                    <button className="btn-edit" style={{ backgroundColor: '#2e7d32', color: '#fff' }} onClick={() => setModalConfirmar({ abierto: true, id: p._id, nombre: `${p.nombre || ''} ${p.apellido || ''}`, accion: 'alta' })} title="Dar de Alta de nuevo">
                      <i className="fas fa-redo"></i>
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {profesionalesFiltrados.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#777', fontStyle: 'italic' }}>
                  {verInhabilitados ? "No hay personal inhabilitado registrado." : "No hay personal activo registrado."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DE DETALLES */}
      {modalDetalle.abierto && modalDetalle.profesional && (
        <div className="modal-overlay">
          <div className="modal-content animacion-fade" style={{ maxWidth: '500px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#4A6741' }}>
                <i className="fas fa-id-card"></i> Ficha del Personal {modalDetalle.profesional.activo === false && "(INHABILITADO)"}
              </h3>
            </div>

            <div style={{ display: 'grid', gap: '10px', fontSize: '15px' }}>
              <p><strong>Nombre Completo:</strong> {modalDetalle.profesional.apellido}, {modalDetalle.profesional.nombre}</p>
              <p><strong>DNI:</strong> {modalDetalle.profesional.dni}</p>
              <p><strong>Rol / Función:</strong> {modalDetalle.profesional.rol || '-'}</p>
              <p><strong>Email:</strong> {modalDetalle.profesional.correo || modalDetalle.profesional.email || '-'}</p>
              <p><strong>Celular:</strong> {modalDetalle.profesional.telefono || '-'}</p>

              <hr style={{ border: '0', height: '1px', background: '#eee', margin: '10px 0' }} />

              <p><strong>¿Es Profesional de Salud?:</strong> {modalDetalle.profesional.esProfesionalSalud ? 'SÍ' : 'NO'}</p>

              {modalDetalle.profesional.esProfesionalSalud && (
                <>
                  <p><strong>Matrícula:</strong> {modalDetalle.profesional.matricula || '-'}</p>
                  <p><strong>Área de Trabajo:</strong> {modalDetalle.profesional.area?.nombre || 'SIN ÁREA ASIGNADA'}</p>

                  <div>
                    <strong style={{ display: 'block', marginBottom: '5px' }}>Especialidades / Enfoques:</strong>
                    {modalDetalle.profesional.especialidades && modalDetalle.profesional.especialidades.length > 0 ? (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '5px' }}>
                        {modalDetalle.profesional.especialidades.map(e => {
                          if (!e) return null;
                          return (
                            <span key={e._id || e} style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #c8e6c9' }}>
                              {e.nombre || e}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <span style={{ color: '#777', fontStyle: 'italic', fontSize: '13px' }}>Sin especialidades cargadas</span>
                    )}
                  </div>
                </>
              )}
            </div>

            <div style={{ marginTop: '25px' }}>
              <Button onClick={() => setModalDetalle({ abierto: false, profesional: null })} variant="secondary" style={{ width: '100%' }}>
                Cerrar Ficha
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DINÁMICO */}
      {modalConfirmar.abierto && (
        <div className="modal-overlay">
          <div className="modal-content animacion-fade">
            <h3>
              <i className={modalConfirmar.accion === 'baja' ? "fas fa-exclamation-triangle" : "fas fa-check-circle"} style={{ color: modalConfirmar.accion === 'baja' ? '#ffb300' : '#4A6741' }}></i>
              {modalConfirmar.accion === 'baja' ? " ¿Confirmar inhabilitación?" : " ¿Rehabilitar personal?"}
            </h3>
            <p>
              {modalConfirmar.accion === 'baja' 
                ? `Se dará de baja del staff activo a ` 
                : `Se volverá a dar de alta en el staff activo a `}
              <strong>{modalConfirmar.nombre}</strong>.
            </p>
            <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
              <Button onClick={() => setModalConfirmar({ abierto: false, id: null, nombre: '', accion: 'baja' })} variant="secondary">
                Cancelar
              </Button>
              <Button onClick={ejecutarCambioEstado} variant="primary" style={{ backgroundColor: modalConfirmar.accion === 'baja' ? '#e53935' : '#4A6741' }}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profesionales;