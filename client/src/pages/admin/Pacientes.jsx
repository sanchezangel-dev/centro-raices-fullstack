import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../../components/Common/Button';
import '../../styles/admin/Pacientes.css';

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  
  // ESTADOS DE FILTRADO Y TOASTS
  const [verInhabilitados, setVerInhabilitados] = useState(false);
  const [toasts, setToasts] = useState([]);

  // NUEVO ESTADO: Control del modal de confirmación personalizado sin window.confirm
  const [confirmarModal, setConfirmarModal] = useState({
    abierto: false,
    paciente: null,
    accion: '' // 'inhabilitar' o 'reactivar'
  });

  const [form, setForm] = useState({
    nombre: '', apellido: '', dni: '', fechaNacimiento: '', telefono: '', email: '',
    poseeObraSocial: false, obraSocial: '', nroAfiliado: '',
    poseeCUD: false, nroCUD: '', vencimientoCUD: '',
    cudDiagnostico: '', cudDescripcion: '', notas: '',
    activo: true
  });

  const API_URL = 'https://centro-raices-fullstack.onrender.com/api/pacientes';

  useEffect(() => { obtenerPacientes(); }, []);

  const mostrarToast = (mensaje, tipo = 'exito') => {
    const nuevoToast = { id: Date.now(), mensaje, tipo };
    setToasts(prev => [...prev, nuevoToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== nuevoToast.id));
    }, 4000);
  };

  const obtenerPacientes = async () => {
    try {
      const res = await axios.get(API_URL);
      setPacientes(res.data);
    } catch (err) { 
      console.error("Error al cargar", err); 
      mostrarToast('Error al conectar con el servidor', 'error');
    }
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

  // DISPARADOR DEL MODAL PERSONALIZADO
  const abrirConfirmarEstado = (paciente) => {
    setConfirmarModal({
      abierto: true,
      paciente: paciente,
      accion: paciente.activo === false ? 'reactivar' : 'inhabilitar'
    });
  };

  // EJECUCIÓN ASÍNCRONA DESDE EL MODAL PROPIO
  const ejecutarCambioEstado = async () => {
    const { paciente, accion } = confirmarModal;
    const nuevoEstado = accion === 'reactivar';

    try {
      await axios.put(`${API_URL}/${paciente._id}`, { ...paciente, activo: nuevoEstado });
      mostrarToast(
        nuevoEstado ? '¡Paciente reactivado con éxito!' : 'Paciente inhabilitado correctamente', 
        nuevoEstado ? 'info' : 'advertencia'
      );
      setConfirmarModal({ abierto: false, paciente: null, accion: '' });
      obtenerPacientes();
    } catch (err) {
      mostrarToast('Error al cambiar el estado del paciente', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datosAEnviar = {
      ...form,
      nombre: form.nombre.trim().toUpperCase(),
      apellido: form.apellido.trim().toUpperCase()
    };

    try {
      if (modoEdicion) {
        await axios.put(`${API_URL}/${pacienteSeleccionado._id}`, datosAEnviar);
        mostrarToast('¡Datos actualizados correctamente!', 'exito');
      } else {
        await axios.post(API_URL, datosAEnviar);
        mostrarToast('¡Paciente registrado con éxito!', 'exito');
      }
      cerrarModal();
      obtenerPacientes();
    } catch (err) {
      mostrarToast(err.response?.data?.mensaje || 'Error en la operación', 'error');
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
      cudDiagnostico: '', cudDescripcion: '', notas: '',
      activo: true
    });
  };

  const pacientesFiltrados = pacientes.filter(p => {
    if (verInhabilitados) return p.activo === false;
    return p.activo !== false;
  });

  return (
    <div className="pacientes-container">
      
      {/* TOASTS GLOBALES CON ÍCONOS FONT AWESOME */}
      <div className="toast-container-global">
        {toasts.map(t => {
          const iconoClass = {
            exito: 'fa-solid fa-circle-check',
            error: 'fa-solid fa-circle-xmark',
            advertencia: 'fa-solid fa-triangle-exclamation',
            info: 'fa-solid fa-circle-info'
          }[t.tipo] || 'fa-solid fa-bell';

          return (
            <div key={t.id} className={`toast-global ${t.tipo}`}>
              <i className={iconoClass} style={{ fontSize: '1.2rem', marginRight: '8px' }}></i>
              <span>{t.mensaje}</span>
            </div>
          );
        })}
      </div>

      <header className="pacientes-header-unified">
        <div className="header-title-group">
          {/* Conservamos el SVG estructural de la cabecera por consistencia de tamaños */}
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
        
        <div className="header-actions-group" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="form-check-wrapper switch-filtro-profesionales" style={{ margin: 0 }}>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={verInhabilitados} 
                onChange={(e) => setVerInhabilitados(e.target.checked)} 
              />
              <span className="slider round" style={{ backgroundColor: verInhabilitados ? '#e67e22' : '#ccc' }}></span>
            </label>
            <span style={{ fontWeight: 600, color: verInhabilitados ? '#e67e22' : '#555' }}>
              {verInhabilitados ? "Viendo Pacientes Inhabilitados" : "Viendo Pacientes Activos"}
            </span>
          </div>

          <button className="btn-primario-unified" onClick={() => setModalAbierto(true)}>
            + Registrar Nuevo Paciente
          </button>
        </div>
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
            {pacientesFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#888', fontWeight: 500 }}>
                  {verInhabilitados ? "No hay pacientes inhabilitados registrados." : "No hay pacientes activos registrados."}
                </td>
              </tr>
            ) : (
              pacientesFiltrados.map(p => (
                <tr key={p._id} className={p.activo === false ? "fila-inhabilitada" : ""}>
                  <td className="font-bold" style={{ opacity: p.activo === false ? 0.6 : 1 }}>
                    {p.apellido.toUpperCase()}, {p.nombre.toUpperCase()} {p.activo === false && "(Inhabilitado)"}
                  </td>
                  <td style={{ opacity: p.activo === false ? 0.6 : 1 }}>{p.dni}</td>
                  <td style={{ opacity: p.activo === false ? 0.6 : 1 }}>{calcularEdad(p.fechaNacimiento)}</td>
                  <td>
                    {p.poseeCUD ? <span className="badge vigent">Vigente</span> : <span className="badge none">No posee</span>}
                  </td>
                  <td className="acciones-td">
                    <button className="btn-icon" onClick={() => abrirDetalle(p)} title="Ver más">
                      <i className="fa-solid fa-eye" style={{ fontSize: '16px' }}></i>
                    </button>
                    
                    {p.activo !== false && (
                      <button className="btn-icon" onClick={() => abrirEditar(p)} title="Editar">
                        <i className="fa-solid fa-pen-to-square" style={{ fontSize: '16px' }}></i>
                      </button>
                    )}

                    <button 
                      className={`btn-icon ${p.activo === false ? "success" : "danger"}`} 
                      onClick={() => abrirConfirmarEstado(p)} 
                      title={p.activo === false ? "Reactivar Paciente" : "Inhabilitar Paciente"}
                    >
                      <i 
                        className={p.activo === false ? "fa-solid fa-rotate-left" : "fa-solid fa-trash-can"} 
                        style={{ fontSize: '16px' }}
                      ></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DE CONFIRMACIÓN CON ÍCONOS DE FONT AWESOME */}
      {confirmarModal.abierto && (
        <div className="modal-overlay" style={{ zIndex: 10000 }}>
          <div className="modal-content animate-slide" style={{ maxWidth: '450px', textAlign: 'center', padding: '30px' }}>
            
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: confirmarModal.accion === 'inhabilitar' ? '#fde8e8' : '#eaf2e8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <i 
                className={confirmarModal.accion === 'inhabilitar' ? "fa-solid fa-user-slash" : "fa-solid fa-user-check"} 
                style={{ 
                  fontSize: '26px', 
                  color: confirmarModal.accion === 'inhabilitar' ? '#e53935' : '#4A6741' 
                }}
              ></i>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '10px', color: '#1e272c' }}>
              {confirmarModal.accion === 'inhabilitar' ? '¿Confirmar inhabilitación?' : '¿Confirmar reactivación?'}
            </h2>
            <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '25px' }}>
              Se dará de {confirmarModal.accion === 'inhabilitar' ? 'baja' : 'alta'} a la ficha del paciente{' '}
              <strong>
                {confirmarModal.paciente?.apellido.toUpperCase()}, {confirmarModal.paciente?.nombre.toUpperCase()}
              </strong>.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button 
                type="button" 
                className="btn-cancel" 
                onClick={() => setConfirmarModal({ abierto: false, paciente: null, accion: '' })}
                style={{ padding: '10px 24px' }}
              >
                Cancelar
              </Button>
              <button 
                type="button" 
                className="btn-primario-unified"
                onClick={ejecutarCambioEstado}
                style={{ 
                  padding: '10px 24px', 
                  backgroundColor: confirmarModal.accion === 'inhabilitar' ? '#d32f2f' : '#4A6741',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORMULARIO */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content animate-slide">
            <div className="modal-header">
              <h2>{modoEdicion ? 'Actualizar Ficha' : 'Nueva Ficha Médica'}</h2>
              <button className="btn-cerrar" onClick={cerrarModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <h3 className="section-title-unified">
                <i className="fa-solid fa-user" style={{ marginRight: '8px', color: '#4A6741' }}></i>
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
                <i className="fa-solid fa-heart-pulse" style={{ marginRight: '8px', color: '#4A6741' }}></i>
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
                <i className="fa-solid fa-id-card" style={{ marginRight: '8px', color: '#4A6741' }}></i>
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
                <Button type="button" className="btn-cancel" onClick={cerrarModal}>
                  Cancelar
                </Button>
                <Button type="submit" className="btn-save">
                  {modoEdicion ? 'Actualizar' : 'Guardar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALLE */}
      {modalDetalle && pacienteSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-content detail-view animate-fade">
            <div className="modal-header">
              <h2>Ficha de Paciente</h2>
              <button className="btn-cerrar" onClick={cerrarModal}>&times;</button>
            </div>
            <div className="detail-grid">
              <div className="detail-item"><strong>PACIENTE:</strong> {pacienteSeleccionado.apellido.toUpperCase()}, {pacienteSeleccionado.nombre.toUpperCase()}</div>
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