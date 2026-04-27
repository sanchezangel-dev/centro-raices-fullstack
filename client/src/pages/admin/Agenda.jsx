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

  // Estado del Formulario
  const [formTurno, setFormTurno] = useState({
    paciente: '',
    profesional: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '',
    sesiones: 15,
    notas: ''
  });

  const API_URL = 'http://localhost:5000/api/turnos';

  useEffect(() => {
    obtenerTurnos();
    cargarSelectores();
  }, [fechaFiltro]);

  const obtenerTurnos = async () => {
    try {
      const res = await axios.get(`${API_URL}?fecha=${fechaFiltro}`);
      setTurnos(res.data);
    } catch (err) {
      console.error("Error al cargar turnos", err);
    }
  };

  const cargarSelectores = async () => {
    try {
      const [resP, resProf] = await Promise.all([
        axios.get('http://localhost:5000/api/pacientes'),
        axios.get('http://localhost:5000/api/profesionales')
      ]);
      setPacientes(resP.data);
      setProfesionales(resProf.data);
    } catch (err) {
      console.error("Error cargando selectores", err);
    }
  };

  const handleChange = (e) => {
    setFormTurno({ ...formTurno, [e.target.name]: e.target.value });
  };

  const prepararEdicion = (turno) => {
    setEditandoId(turno._id);
    setTipoRegistro('individual');
    setFormTurno({
      paciente: turno.paciente?._id || '',
      profesional: turno.profesional?._id || '',
      fecha: turno.fecha.split('T')[0], // Limpia el formato ISO
      hora: turno.hora,
      notas: turno.notas || '',
      sesiones: 1
    });
    setModalAbierto(true);
  };

  const handleSubmitTurno = async (e) => {
    e.preventDefault();
    setCargando(true);
    
    try {
      if (editandoId) {
        // MODO EDICIÓN (PUT)
        await axios.put(`${API_URL}/${editandoId}`, formTurno);
        alert('Turno actualizado correctamente 📝');
      } else {
        // MODO NUEVO (POST)
        const endpoint = tipoRegistro === 'individual' 
          ? `${API_URL}/admision` 
          : `${API_URL}/plan-tratamiento`;

        const payload = tipoRegistro === 'individual' 
          ? { ...formTurno } 
          : { ...formTurno, fechaInicio: formTurno.fecha };

        const res = await axios.post(endpoint, payload);
        alert(tipoRegistro === 'individual' ? 'Turno agendado! 🎉' : `${res.data.mensaje}`);
      }
      
      cerrarModal();
      obtenerTurnos();
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error en la operación');
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await axios.patch(`${API_URL}/${id}/estado`, { estado: nuevoEstado });
      obtenerTurnos();
    } catch (err) {
      alert("No se pudo cambiar el estado");
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditandoId(null); // Importante: limpiar el ID de edición
    setFormTurno({
      paciente: '', profesional: '', fecha: fechaFiltro,
      hora: '', sesiones: 15, notas: ''
    });
  };

  return (
    <div className="pacientes-container">
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
          <button className="btn-secundario" onClick={() => {setTipoRegistro('plan'); setModalAbierto(true)}}>
            Generar Plan
          </button>
          <button className="btn-primario-unified" onClick={() => {setTipoRegistro('individual'); setModalAbierto(true)}}>
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
                <td>{t.paciente?.apellido.toUpperCase()}, {t.paciente?.nombre}</td>
                <td>{t.profesional?.apellido}</td>
                <td><span className={`tipo-tag ${t.tipoTurno.toLowerCase()}`}>{t.tipoTurno}</span></td>
                <td>
                  <select 
                    className={`estado-select ${t.estado.toLowerCase()}`}
                    value={t.estado} 
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
                    title="Editar Turno" 
                    onClick={() => prepararEdicion(t)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '50px', color: '#999'}}>No hay turnos agendados para este día</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content animate-slide">
            <div className="modal-header">
              <h2>{editandoId ? 'Editar Turno' : (tipoRegistro === 'individual' ? 'Nueva Admisión' : 'Generar Plan')}</h2>
              <button className="btn-cerrar" onClick={cerrarModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmitTurno}>
              <h3 className="section-title-unified">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Asignación de Turno
              </h3>

              <div className="form-grid">
                <div className="form-group">
                  <label>Paciente *</label>
                  <select name="paciente" value={formTurno.paciente} onChange={handleChange} required>
                    <option value="">Seleccionar...</option>
                    {pacientes.map(p => <option key={p._id} value={p._id}>{p.apellido.toUpperCase()}, {p.nombre}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Profesional *</label>
                  <select name="profesional" value={formTurno.profesional} onChange={handleChange} required>
                    <option value="">Seleccionar...</option>
                    {profesionales.map(prof => <option key={prof._id} value={prof._id}>{prof.apellido}, {prof.nombre}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>{tipoRegistro === 'individual' ? 'Fecha' : 'Fecha de Inicio'} *</label>
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