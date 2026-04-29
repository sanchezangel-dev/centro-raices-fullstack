import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/admin/Profesionales.css';

const Profesionales = () => {
  const [profesionales, setProfesionales] = useState([]);
  const [mostrarPerfilProfesional, setMostrarPerfilProfesional] = useState(false);
  const [otroTitulo, setOtroTitulo] = useState(false);

  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  const [modalConfirmar, setModalConfirmar] = useState({ abierto: false, id: null, nombre: '' });
  const [notificacion, setNotificacion] = useState({ mostrar: false, mensaje: '', tipo: '' });

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    rol: '', // Campo nuevo
    email: '',
    telefono: '',
    matricula: '',
    esProfesionalSalud: false,
    tipoTitulo: '',
    tituloPersonalizado: '',
    enfoque: '',
    activo: true
  });

  useEffect(() => {
    fetchProfesionales();
  }, []);

  const fetchProfesionales = async () => {
    try {
      const res = await axios.get('https://centro-raices-fullstack.onrender.com/api/profesionales');
      setProfesionales(res.data);
    } catch (error) {
      mostrarAviso("Error de conexión", "error");
    }
  };

  const mostrarAviso = (msg, tipo) => {
    setNotificacion({ mostrar: true, mensaje: msg, tipo });
    setTimeout(() => setNotificacion({ mostrar: false, mensaje: '', tipo: '' }), 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'tipoTitulo') setOtroTitulo(value === 'Otro');
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const datosAEnviar = {
      ...formData,
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      dni: formData.dni.trim(),
      rol: formData.rol.trim(),
      enfoque: formData.enfoque.trim(),
      tipoTitulo: otroTitulo ? formData.tituloPersonalizado : formData.tipoTitulo,
      esProfesionalSalud: mostrarPerfilProfesional
    };

    try {
      if (editando) {
        await axios.put(`https://centro-raices-fullstack.onrender.com/api/profesionales/${idEditar}`, datosAEnviar);
        mostrarAviso("¡Datos actualizados!", "exito");
      } else {
        await axios.post('https://centro-raices-fullstack.onrender.com/api/profesionales', datosAEnviar);
        mostrarAviso("¡Registro exitoso!", "exito");
      }
      limpiarFormulario();
      fetchProfesionales();
    } catch (error) {
      mostrarAviso(error.response?.data?.mensaje || "Error en la operación", "error");
    }
  };

  const limpiarFormulario = () => {
    setFormData({ 
      nombre: '', apellido: '', dni: '', rol: '', email: '', telefono: '', 
      matricula: '', tipoTitulo: '', tituloPersonalizado: '', 
      enfoque: '', activo: true 
    });
    setMostrarPerfilProfesional(false);
    setEditando(false);
    setIdEditar(null);
    setOtroTitulo(false);
  };

  const prepararEdicion = (p) => {
    setEditando(true);
    setIdEditar(p._id);
    setMostrarPerfilProfesional(p.esProfesionalSalud);
    
    const opcionesSelect = ["Psicólogia", "Psicopedagogía", "Fonoaudiología", "Psiquiatría", "TOcupacional"];
    const esOtro = p.tipoTitulo && !opcionesSelect.includes(p.tipoTitulo);

    setFormData({
      ...p,
      email: p.email || '',
      telefono: p.telefono || '',
      rol: p.rol || '',
      matricula: p.matricula || '',
      enfoque: p.enfoque || '',
      tipoTitulo: esOtro ? 'Otro' : (p.tipoTitulo || ''),
      tituloPersonalizado: esOtro ? p.tipoTitulo : ''
    });
    setOtroTitulo(esOtro);
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
          {editando && <button type="button" onClick={limpiarFormulario} className="btn-cancel">Cancelar</button>}
        </div>

        <div className="form-grid">
          <input type="text" name="nombre" placeholder="Nombre *" value={formData.nombre} onChange={handleChange} required />
          <input type="text" name="apellido" placeholder="Apellido *" value={formData.apellido} onChange={handleChange} required />
          <input type="text" name="dni" placeholder="DNI *" value={formData.dni} onChange={handleChange} required />
          <input type="text" name="rol" placeholder="Rol / Función (Ej: Tallerista, Recepción)" value={formData.rol} onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
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
            <div className="form-grid">
              <input type="text" name="matricula" placeholder="N° de Matrícula" value={formData.matricula} onChange={handleChange} />
              <select name="tipoTitulo" value={formData.tipoTitulo} onChange={handleChange}>
                <option value="">Seleccione Título...</option>
                <option value="Psicólogia">Psicólogia</option>
                <option value="Psicopedagogía">Psicopedagogía</option>
                <option value="Fonoaudiología">Fonoaudiología</option>
                <option value="Psiquiatría">Psiquiatría</option>
                <option value="TOcupacional">Terapia Ocupacional</option>
                <option value="Otro">Otro...</option>
              </select>
              {otroTitulo && (
                <input type="text" name="tituloPersonalizado" placeholder="Especifique Título" value={formData.tituloPersonalizado} onChange={handleChange} />
              )}
            </div>
            <div className="form-grid" style={{marginTop: '10px'}}>
              <input type="text" name="enfoque" placeholder="Enfoque Teórico (ej: TCC, Gestalt, TEA...)" value={formData.enfoque} onChange={handleChange} />
            </div>
          </div>
        )}

        <button type="submit" className="btn-guardar">
          <i className="fas fa-save"></i> {editando ? " Actualizar Staff" : " Guardar en Staff"}
        </button>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>DNI</th>
              <th>Rol / Función</th>
              <th>Título / Enfoque</th>
              <th>Matrícula</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profesionales.map(p => (
              <tr key={p._id}>
                <td>{p.apellido}, {p.nombre}</td>
                <td>{p.dni}</td>
                <td>{p.rol || '-'}</td>
                <td>{p.esProfesionalSalud ? `${p.tipoTitulo} (${p.enfoque || 'S/E'})` : 'Staff General'}</td>
                <td>{p.matricula || '-'}</td>
                <td className="actions-cell">
                  <button className="btn-edit" onClick={() => prepararEdicion(p)}>
                    <i className="fas fa-pen"></i>
                  </button>
                  <button className="btn-delete" onClick={() => setModalConfirmar({ abierto: true, id: p._id, nombre: `${p.nombre} ${p.apellido}` })}>
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalConfirmar.abierto && (
        <div className="modal-overlay">
          <div className="modal-content animacion-fade">
            <h3><i className="fas fa-exclamation-triangle"></i> ¿Confirmar baja?</h3>
            <p>Se dará de baja a <strong>{modalConfirmar.nombre}</strong>.</p>
            <div className="modal-actions">
              <button onClick={() => setModalConfirmar({ abierto: false, id: null, nombre: '' })} className="btn-modal-cancel">Cancelar</button>
              <button onClick={confirmarEliminacion} className="btn-modal-confirm">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profesionales;