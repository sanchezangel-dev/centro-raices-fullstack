import React, { useState, useEffect } from 'react';
import axios from 'axios';
// IMPORTAMOS TU COMPONENTE REUTILIZABLE DE BOTÓN
import Button from '../../components/Common/Button';
import '../../styles/admin/Profesionales.css';

const Profesionales = () => {
  const [profesionales, setProfesionales] = useState([]);
  const [areas, setAreas] = useState([]);
  const [todasEspecialidades, setTodasEspecialidades] = useState([]);
  const [especialidadesFiltradas, setEspecialidadesFiltradas] = useState([]);

  const [mostrarPerfilProfesional, setMostrarPerfilProfesional] = useState(false);
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  const [modalConfirmar, setModalConfirmar] = useState({ abierto: false, id: null, nombre: '' });
  const [notificacion, setNotificacion] = useState({ mostrar: false, mensaje: '', tipo: '' });
  const [modalDetalle, setModalDetalle] = useState({ abierto: false, profesional: null });

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    rol: '',
    email: '', // Unificado con el backend
    telefono: '',
    matricula: '', // Acá solo guardaremos los números que ingrese el usuario
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
      const filtradas = todasEspecialidades.filter(esp => esp.area === formData.area || esp.area?._id === formData.area);
      setEspecialidadesFiltradas(filtradas);
    } else {
      setEspecialidadesFiltradas([]);
    }
  }, [formData.area, todasEspecialidades]);

  const fetchProfesionales = async () => {
    try {
      const res = await axios.get('https://centro-raices-fullstack.onrender.com/api/profesionales');
      setProfesionales(res.data);
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
      setAreas(resAreas.data);
      setTodasEspecialidades(resEsps.data);
    } catch (error) {
      mostrarAviso("Error al cargar configuraciones de áreas", "error");
    }
  };

  const mostrarAviso = (msg, tipo) => {
    setNotificacion({ mostrar: true, mensaje: msg, tipo });
    setTimeout(() => setNotificacion({ mostrar: false, mensaje: '', tipo: '' }), 3000);
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

    // 1. Limpiamos el valor para evitar duplicar el prefijo MN-
    let matriculaIngresada = formData.matricula.trim().toUpperCase();
    // Quitamos cualquier "MN-" o "MN" que ya tenga al principio para no duplicar
    matriculaIngresada = matriculaIngresada.replace(/^MN-/, '').replace(/^MN/, '');

    const matriculaFormateada = matriculaIngresada ? `MN-${matriculaIngresada}` : '';

    // 2. Armamos el objeto definitivo asegurando los obligatorios del modelo
    const datosAEnviar = {
      ...formData,
      nombre: formData.nombre.trim().toUpperCase(),
      apellido: formData.apellido.trim().toUpperCase(),
      // Si el rol está vacío, le ponemos 'PROFESIONAL' por defecto para evitar el Error 400
      rol: formData.rol.trim() ? formData.rol.trim().toUpperCase() : 'PROFESIONAL',
      matricula: matriculaFormateada,
      dni: formData.dni.trim(),
      correo: formData.email.trim().toLowerCase(),

      esProfesionalSalud: mostrarPerfilProfesional,
      area: mostrarPerfilProfesional ? formData.area : undefined,
      especialidades: mostrarPerfilProfesional ? formData.especialidades : []
    };

    try {
      if (editando) {
        // Hacemos el PUT al servidor
        await axios.put(`https://centro-raices-fullstack.onrender.com/api/profesionales/${idEditar}`, datosAEnviar);
        mostrarAviso("¡Datos actualizados!", "exito");
        
        // Refrescamos la lista limpia y poblada desde el backend de forma síncrona
        await fetchProfesionales();
      } else {
        await axios.post('https://centro-raices-fullstack.onrender.com/api/profesionales', datosAEnviar);
        mostrarAviso("¡Registro exitoso!", "exito");
        await fetchProfesionales();
      }
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
    setEditando(true);
    setIdEditar(p._id);
    setMostrarPerfilProfesional(p.esProfesionalSalud);

    // Al editar, si ya viene con "MN-1234", le removemos el "MN-" para que en el input solo queden los números
    const numeroMatriculaLimpio = p.matricula ? p.matricula.replace(/^MN-/, '').replace(/^MN/, '') : '';

    setFormData({
      ...p,
nombre: p.nombre || '',
      apellido: p.apellido || '',
      dni: p.dni || '',
      // Si viene como correo o email, lo volcamos al estado local 'email' del input
      email: p.correo || p.email || '', 
      rol: p.rol || 'PROFESIONAL',
      telefono: p.telefono || '',
      matricula: numeroMatriculaLimpio,
      area: p.area?._id || p.area || '',
      especialidades: p.especialidades ? p.especialidades.map(esp => esp._id || esp) : []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmarEliminacion = async () => {
    try {
      await axios.delete(`https://centro-raices-fullstack.onrender.com/api/profesionales/${modalConfirmar.id}`);
      mostrarAviso("Baja procesada", "exito");
      setModalConfirmar({ abierto: false, id: null, nombre: '' });
      fetchProfesionales();
    } catch (error) {
      mostrarAviso("Error al eliminar", "error");
    }
  };

  return (
    <div className="profesionales-container">
      {notificacion.mostrar && (
        <div className={`toast-aviso ${notificacion.tipo}`}>{notificacion.mensaje}</div>
      )}

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
              {/* INPUT DE MATRÍCULA CON PREFIJO MN- VISUAL */}
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

        {/* BOTONERA CON TU COMPONENTE BUTTON */}
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

      {/* TABLA OPTIMIZADA CON NUEVAS COLUMNAS DE ACCESO RÁPIDO */}
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
            {profesionales.map(p => (
              <tr key={p._id}>
                <td>{p.apellido}, {p.nombre}</td>
                <td>{p.rol || '-'}</td>
                <td>
                  {p.esProfesionalSalud ? (
                    <strong style={{ color: '#2e7d32' }}>{p.area?.nombre || 'SIN ÁREA'}</strong>
                  ) : (
                    <span style={{ color: '#777', fontStyle: 'italic' }}>STAFF GENERAL</span>
                  )}
                </td>
                <td>{p.telefono || '-'}</td>
                <td>{p.matricula || '-'}</td>
                <td className="actions-cell">
                  {/* ACCIONES COMPACTAS */}
                  <button className="btn-edit" style={{ background: '#0288d1', marginRight: '5px' }} onClick={() => setModalDetalle({ abierto: true, profesional: p })} title="Ver Detalles">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="btn-edit" onClick={() => prepararEdicion(p)} title="Editar">
                    <i className="fas fa-pen"></i>
                  </button>
                  <button className="btn-delete" onClick={() => setModalConfirmar({ abierto: true, id: p._id, nombre: `${p.nombre} ${p.apellido}` })} title="Eliminar">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE DETALLES (OJITO) - INCLUYE DNI, EMAIL Y BADGES DE ESPECIALIDADES */}
      {modalDetalle.abierto && modalDetalle.profesional && (
        <div className="modal-overlay">
          <div className="modal-content animacion-fade" style={{ maxWidth: '500px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#2e7d32' }}>
                <i className="fas fa-id-card"></i> Ficha del Personal
              </h3>
            </div>

            <div style={{ display: 'grid', gap: '10px', fontSize: '15px' }}>
              <p><strong>Nombre Completo:</strong> {modalDetalle.profesional.apellido}, {modalDetalle.profesional.nombre}</p>
              <p><strong>DNI:</strong> {modalDetalle.profesional.dni}</p>
              <p><strong>Rol / Función:</strong> {modalDetalle.profesional.rol || '-'}</p>
              <p><strong>Email:</strong> {modalDetalle.profesional.email || modalDetalle.profesional.correo || '-'}</p>
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
                        {modalDetalle.profesional.especialidades.map(e => (
                          <span key={e._id} style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #c8e6c9' }}>
                            {e.nombre}
                          </span>
                        ))}
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

      {/* MODAL DE CONFIRMACIÓN DE BAJA */}
      {modalConfirmar.abierto && (
        <div className="modal-overlay">
          <div className="modal-content animacion-fade">
            <h3><i className="fas fa-exclamation-triangle"></i> ¿Confirmar baja?</h3>
            <p>Se dará de baja a <strong>{modalConfirmar.nombre}</strong>.</p>
            <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
              <Button onClick={() => setModalConfirmar({ abierto: false, id: null, nombre: '' })} variant="secondary">
                Cancelar
              </Button>
              <Button onClick={confirmarEliminacion} variant="primary">
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