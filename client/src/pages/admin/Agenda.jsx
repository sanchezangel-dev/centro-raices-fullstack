import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/admin/Agenda.css';

const Agenda = () => {
  // Estados de datos
  const [turnos, setTurnos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [profesionales, setProfesionales] = useState([]);

  // Estados de control UI
  const [fechaFiltro, setFechaFiltro] = useState(new Date().toISOString().split('T')[0]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoRegistro, setTipoRegistro] = useState('individual'); // 'individual' o 'plan'
  const [editandoId, setEditandoId] = useState(null); // ID para saber si editamos
  const [cargando, setCargando] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Estado del Formulario
  const [formTurno, setFormTurno] = useState({
    paciente: '',
    profesional: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '',
    sesiones: 15,
    notas: ''
  });

  const API_URL = 'https://centro-raices-fullstack.onrender.com/api/turnos';

  useEffect(() => {
    obtenerTurnos();
    cargarSelectores();
  }, [fechaFiltro]);

  const mostrarToast = (mensaje, tipo = 'exito') => {
    const nuevoToast = { id: Date.now(), mensaje, tipo };
    setToasts(prev => [...prev, nuevoToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== nuevoToast.id));
    }, 4000);
  };

  const obtenerTurnos = async () => {
    try {
      const res = await axios.get(`${API_URL}?fecha=${fechaFiltro}`);
      setTurnos(res.data);
    } catch (err) {
      console.error("Error al cargar turnos", err);
      mostrarToast('Error al cargar la grilla de turnos', 'error');
    }
  };

  const cargarSelectores = async () => {
    try {
      const [resP, resProf] = await Promise.all([
        axios.get('https://centro-raices-fullstack.onrender.com/api/pacientes'),
        axios.get('https://centro-raices-fullstack.onrender.com/api/profesionales')
      ]);
      setPacientes(resP.data || []);
      setProfesionales(resProf.data || []);
    } catch (err) {
      console.error("Error cargando selectores", err);
      mostrarToast('Error al cargar la lista de pacientes o profesionales', 'error');
    }
  };

  const handleChange = (e) => {
    setFormTurno({ ...formTurno, [e.target.name]: e.target.value });
  };

  const prepararEdicion = (turno) => {
    setEditandoId(turno._id);
    // Identificamos dinámicamente si el turno original pertenecía a un plan o admisión individual
    setTipoRegistro(turno.tipoTurno?.toLowerCase() === 'plan' ? 'plan' : 'individual');

    setFormTurno({
      paciente: turno.paciente?._id || '',
      profesional: turno.profesional?._id || '',
      fecha: turno.fecha ? turno.fecha.split('T')[0] : fechaFiltro,
      hora: turno.hora || '',
      notas: turno.notas || '',
      sesiones: 1 // En edición modificamos la sesión individual seleccionada
    });
    setModalAbierto(true);
  };

  const handleSubmitTurno = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      if (editandoId) {
        // MODO EDICIÓN (PUT) - Modifica este turno específico (útil para reasignar fechas/profesionales)
        await axios.put(`${API_URL}/${editandoId}`, formTurno);
        mostrarToast('¡Turno actualizado correctamente! 📝', 'exito');
      } else {
        // MODO NUEVO (POST)
        const endpoint = tipoRegistro === 'individual'
          ? `${API_URL}/admision`
          : `${API_URL}/plan-tratamiento`;

        const payload = tipoRegistro === 'individual'
          ? { ...formTurno }
          : { ...formTurno, fechaInicio: formTurno.fecha };

        const res = await axios.post(endpoint, payload);
        mostrarToast(tipoRegistro === 'individual' ? '¡Turno agendado con éxito! 🎉' : `${res.data.mensaje}`, 'exito');
      }

      cerrarModal();
      obtenerTurnos();
    } catch (err) {
      mostrarToast(err.response?.data?.mensaje || 'Error en la operación', 'error');
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await axios.patch(`${API_URL}/${id}/estado`, { estado: nuevoEstado });
      mostrarToast(`Estado cambiado a ${nuevoEstado}`, 'info');
      obtenerTurnos();
    } catch (err) {
      mostrarToast('No se pudo cambiar el estado del turno', 'error');
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditandoId(null);
    setFormTurno({
      paciente: '', profesional: '', fecha: fechaFiltro,
      hora: '', sesiones: 15, notas: ''
    });
  };

  // FILTRADO SEGURO: Evita romper la app si "formTurno.profesional" o "prof" son indefinidos
  const profesionalesParaSelector = profesionales.filter(prof => {
    if (!prof) return false;
    // Si es un turno nuevo, mostramos solo los activos
    if (!editandoId) return prof.activo !== false;
    // Si estamos editando, mostramos activos O al profesional viejo que ya estaba guardado en el turno
    return prof.activo !== false || (formTurno.profesional && prof._id === formTurno.profesional);
  });

  return (
    <div className="pacientes-container">

      {/* TOASTS GLOBALES */}
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
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4A6741" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <div>
            <h1>Agenda Diaria</h1>
            <input
              type="date"
              className="agenda-date-picker"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
            />
          </div>
        </div>
        <div className="btn-group">
          <button className="btn-secundario" onClick={() => { setTipoRegistro('plan'); setModalAbierto(true) }}>
            Generar Plan
          </button>
          <button className="btn-primario-unified" onClick={() => { setTipoRegistro('individual'); setModalAbierto(true) }}>
            + Nueva Admisión
          </button>
        </div>
      </header>

      <div className="header-line"></div>

      <div className="tabla-wrapper animate-fade">
        <table className="pacientes-tabla">
          <thead>
            <tr>
              <th>Hora</th>
              <th>Paciente</th>
              <th>Profesional</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos.length > 0 ? turnos.map(t => (
              <tr key={t._id}>
                <td className="font-bold">{t.hora} hs</td>
                <td>
                  {t.paciente
                    ? `${t.paciente.apellido?.toUpperCase()}, ${t.paciente.nombre}`
                    : <span style={{ color: '#999', italic: 'true' }}>Paciente no encontrado</span>
                  }
                </td>
                <td>
                  {t.profesional ? (
                    <>
                      {t.profesional.apellido}, {t.profesional.nombre}
                      {t.profesional.activo === false && (
                        <span style={{ fontSize: '0.8rem', color: '#e74c3c', marginLeft: '5px', fontWeight: 'bold' }}>(Inactivo)</span>
                      )}
                    </>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: '#f39c12', fontWeight: 'bold' }}>⚠️ Sin profesional asignado</span>
                  )}
                </td>
                <td><span className={`tipo-tag ${t.tipoTurno?.toLowerCase() || 'individual'}`}>{t.tipoTurno || 'Admisión'}</span></td>
                <td>
                  <select
                    className={`estado-select ${t.estado?.toLowerCase() || 'pendiente'}`}
                    value={t.estado || 'Pendiente'}
                    onChange={(e) => cambiarEstado(t._id, e.target.value)}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Realizado">Realizado</option>
                    <option value="Cancelado">Cancelado</option>
                    <option value="Ausente">Ausente</option>
                  </select>
                </td>
                <td className="acciones-td">
                  <button
                    className="btn-icon"
                    title="Modificar Turno o Fecha/Profesional"
                    onClick={() => prepararEdicion(t)}
                  >
                    <i className="fa-solid fa-pen-to-square" style={{ fontSize: '16px' }}></i>
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '50px', color: '#999' }}>No hay turnos agendados para este día</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content animate-slide">
            <div className="modal-header">
              <h2>{editandoId ? 'Modificar Turno / Reasignar' : (tipoRegistro === 'individual' ? 'Nueva Admisión' : 'Generar Plan')}</h2>
              <button className="btn-cerrar" onClick={cerrarModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmitTurno}>
              <h3 className="section-title-unified">
                <i className="fa-solid fa-calendar-check" style={{ marginRight: '8px', color: '#4A6741' }}></i>
                Asignación de Turno
              </h3>

              <div className="form-grid">
                <div className="form-group">
                  <label>Paciente *</label>
                  <select name="paciente" value={formTurno.paciente} onChange={handleChange} required>
                    <option value="">Seleccionar...</option>
                    {pacientes.map(p => <option key={p._id} value={p._id}>{p.apellido?.toUpperCase()}, {p.nombre}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Profesional *</label>
                  <select name="profesional" value={formTurno.profesional} onChange={handleChange} required>
                    <option value="">Seleccionar...</option>
                    {profesionales
                      .filter(p => p.activo !== false).map(prof => (
                        <option key={prof._id} value={prof._id}>
                          {prof.apellido}, {prof.nombre} {prof.activo === false ? ' (INACTIVO)' : ''}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>{editandoId ? 'Cambiar Fecha' : (tipoRegistro === 'individual' ? 'Fecha' : 'Fecha de Inicio')} *</label>
                  <input type="date" name="fecha" value={formTurno.fecha} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Hora *</label>
                  <input type="time" name="hora" value={formTurno.hora} onChange={handleChange} required />
                </div>

                {tipoRegistro === 'plan' && !editandoId && (
                  <div className="form-group">
                    <label>Cantidad de Sesiones</label>
                    <input type="number" name="sesiones" value={formTurno.sesiones} onChange={handleChange} />
                  </div>
                )}
              </div>

              <div className="form-group mt-4">
                <label>Notas Adicionales</label>
                <textarea name="notas" value={formTurno.notas} onChange={handleChange} rows="2"></textarea>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={cerrarModal}>Cancelar</button>
                <button type="submit" className="btn-save" disabled={cargando}>
                  {cargando ? 'Procesando...' : (editandoId ? 'Guardar Cambios' : 'Agendar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;