import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/admin/Pacientes.css';

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [form, setForm] = useState({
    nombre: '', apellido: '', dni: '', fechaNacimiento: '', telefono: '', email: '',
    poseeObraSocial: false, obraSocial: '', nroAfiliado: '',
    poseeCUD: false, nroCUD: '', vencimientoCUD: '',
    cudDiagnostico: '', cudDescripcion: '', notas: ''
  });

  const API_URL = 'http://localhost:5000/api/pacientes';

  useEffect(() => { obtenerPacientes(); }, []);

  const obtenerPacientes = async () => {
    try {
      const res = await axios.get(API_URL);
      setPacientes(res.data);
    } catch (err) { console.error("Error al cargar", err); }
  };

  const calcularEdad = (fecha) => {
    if (!fecha) return "-";
    const hoy = new Date();
    const cumple = new Date(fecha);
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const m = hoy.getMonth() - cumple.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) edad--;
    return `${edad} años`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  // Función Eliminar (Baja lógica/física según tu backend)
  const eliminarPaciente = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este paciente?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert('Paciente eliminado correctamente 🗑️');
        obtenerPacientes();
      } catch (err) {
        alert('Error al eliminar el paciente');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        await axios.put(`${API_URL}/${pacienteSeleccionado._id}`, form);
        alert('¡Datos actualizados correctamente! 🔄');
      } else {
        await axios.post(API_URL, form);
        alert('¡Paciente registrado con éxito! 🎉');
      }
      cerrarModal();
      obtenerPacientes();
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error en la operación');
    }
  };

  const abrirDetalle = (p) => {
    setPacienteSeleccionado(p);
    setModalDetalle(true);
  };

  const abrirEditar = (p) => {
    setForm({
      ...p,
      fechaNacimiento: p.fechaNacimiento ? p.fechaNacimiento.split('T')[0] : '',
      vencimientoCUD: p.vencimientoCUD ? p.vencimientoCUD.split('T')[0] : ''
    });
    setPacienteSeleccionado(p);
    setModoEdicion(true);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setModalDetalle(false);
    setModoEdicion(false);
    setPacienteSeleccionado(null);
    setForm({
      nombre: '', apellido: '', dni: '', fechaNacimiento: '', telefono: '', email: '',
      poseeObraSocial: false, obraSocial: '', nroAfiliado: '',
      poseeCUD: false, nroCUD: '', vencimientoCUD: '',
      cudDiagnostico: '', cudDescripcion: '', notas: ''
    });
  };

  return (
    <div className="pacientes-container">
      {/* HEADER UNIFICADO CON "CONFIGURACIÓN DE ÁREAS" */}
      <header className="pacientes-header-unified">
        <div className="header-title-group">
          <svg className="header-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4A6741" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <div>
            <h1>Gestión de Pacientes</h1>
            <p className="subtitle">Gestión integral de la base de datos de pacientes</p>
          </div>
        </div>
        <button className="btn-primario-unified" onClick={() => setModalAbierto(true)}>
          + Registrar Nuevo Paciente
        </button>
      </header>

      <div className="header-line"></div>

      <div className="tabla-wrapper animate-fade">
        <table className="pacientes-tabla">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>DNI</th>
              <th>Edad</th>
              <th>CUD</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map(p => (
              <tr key={p._id}>
                <td className="font-bold">{p.apellido.toUpperCase()}, {p.nombre}</td>
                <td>{p.dni}</td>
                <td>{calcularEdad(p.fechaNacimiento)}</td>
                <td>
                  {p.poseeCUD ? <span className="badge vigent">Vigente</span> : <span className="badge none">No posee</span>}
                </td>
                <td className="acciones-td">
                  <button className="btn-icon" onClick={() => abrirDetalle(p)} title="Ver más">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                  <button className="btn-icon" onClick={() => abrirEditar(p)} title="Editar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button className="btn-icon danger" onClick={() => eliminarPaciente(p._id)} title="Eliminar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FORMULARIO CON COHERENCIA VISUAL */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content animate-slide">
            <div className="modal-header">
              <h2>{modoEdicion ? 'Actualizar Ficha' : 'Nueva Ficha Médica'}</h2>
              <button className="btn-cerrar" onClick={cerrarModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <h3 className="section-title-unified">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Datos Personales
              </h3>
              <div className="form-grid">
                <div className="form-group"><label>Nombre *</label><input type="text" name="nombre" value={form.nombre} onChange={handleChange} required /></div>
                <div className="form-group"><label>Apellido *</label><input type="text" name="apellido" value={form.apellido} onChange={handleChange} required /></div>
                <div className="form-group"><label>DNI *</label><input type="number" name="dni" value={form.dni} onChange={handleChange} required /></div>
                <div className="form-group"><label>Fecha Nac.</label><input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} /></div>
                <div className="form-group"><label>Teléfono</label><input type="text" name="telefono" value={form.telefono} onChange={handleChange} /></div>
                <div className="form-group"><label>Email</label><input type="email" name="email" value={form.email} onChange={handleChange} /></div>
              </div>

              <h3 className="section-title-unified">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                Cobertura Médica
              </h3>
              <div className="form-check-wrapper">
                <label className="switch">
                  <input type="checkbox" name="poseeObraSocial" checked={form.poseeObraSocial} onChange={handleChange} />
                  <span className="slider round"></span>
                </label>
                <span>¿Tiene Obra Social?</span>
              </div>
              {form.poseeObraSocial && (
                <div className="sub-card animate-fade">
                  <div className="form-grid">
                    <div className="form-group"><label>Obra Social</label><input type="text" name="obraSocial" value={form.obraSocial} onChange={handleChange} /></div>
                    <div className="form-group"><label>N° Afiliado</label><input type="text" name="nroAfiliado" value={form.nroAfiliado} onChange={handleChange} /></div>
                  </div>
                </div>
              )}

              <h3 className="section-title-unified">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Información CUD
              </h3>
              <div className="form-check-wrapper">
                <label className="switch">
                  <input type="checkbox" name="poseeCUD" checked={form.poseeCUD} onChange={handleChange} />
                  <span className="slider round"></span>
                </label>
                <span>Posee CUD</span>
              </div>
              {form.poseeCUD && (
                <div className="sub-card animate-fade">
                  <div className="form-grid">
                    <div className="form-group"><label>N° CUD</label><input type="text" name="nroCUD" value={form.nroCUD} onChange={handleChange} /></div>
                    <div className="form-group"><label>Vencimiento</label><input type="date" name="vencimientoCUD" value={form.vencimientoCUD} onChange={handleChange} /></div>
                  </div>
                  <div className="form-group mt-2"><label>Diagnóstico</label><textarea name="cudDiagnostico" value={form.cudDiagnostico} onChange={handleChange} rows="2"></textarea></div>
                  <div className="form-group"><label>Descripción</label><textarea name="cudDescripcion" value={form.cudDescripcion} onChange={handleChange} rows="2"></textarea></div>
                </div>
              )}

              <div className="form-group mt-4"><label>Notas Adicionales</label><textarea name="notas" value={form.notas} onChange={handleChange} rows="2"></textarea></div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={cerrarModal}>Cancelar</button>
                <button type="submit" className="btn-save">{modoEdicion ? 'Actualizar' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALLE (VER MÁS) */}
      {modalDetalle && pacienteSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-content detail-view animate-fade">
            <div className="modal-header">
              <h2>Ficha de Paciente</h2>
              <button className="btn-cerrar" onClick={cerrarModal}>&times;</button>
            </div>
            <div className="detail-grid">
              <div className="detail-item"><strong>PACIENTE:</strong> {pacienteSeleccionado.apellido.toUpperCase()}, {pacienteSeleccionado.nombre}</div>
              <div className="detail-item"><strong>DNI:</strong> {pacienteSeleccionado.dni}</div>
              <div className="detail-item"><strong>EDAD:</strong> {calcularEdad(pacienteSeleccionado.fechaNacimiento)}</div>
              <div className="detail-item"><strong>TELÉFONO:</strong> {pacienteSeleccionado.telefono || '-'}</div>
              <div className="detail-item"><strong>OBRA SOCIAL:</strong> {pacienteSeleccionado.obraSocial || 'No posee'}</div>
              <div className="detail-item"><strong>N° AFILIADO:</strong> {pacienteSeleccionado.nroAfiliado || '-'}</div>
              <div className="detail-item full"><strong>DIAGNÓSTICO CUD:</strong> <p>{pacienteSeleccionado.cudDiagnostico || 'Sin datos'}</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pacientes;