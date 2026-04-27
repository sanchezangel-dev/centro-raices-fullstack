import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/admin/Agenda.css'; // Reutilizamos tus estilos para no trabajar doble

const TurnosGenerales = () => {
  const [turnos, setTurnos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const API_URL = 'http://localhost:5000/api/turnos';

  useEffect(() => {
    const obtenerTodosLosTurnos = async () => {
      try {
        // Traemos todos sin el query de fecha para que sea el historial completo
        const res = await axios.get(`${API_URL}`); 
        setTurnos(res.data);
      } catch (err) {
        console.error("Error al cargar el historial", err);
      }
    };
    obtenerTodosLosTurnos();
  }, []);

  // Lógica de filtrado por nombre/apellido y por estado
  const turnosFiltrados = turnos.filter(t => {
    const coincideNombre = 
      t.paciente?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.paciente?.apellido.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideEstado = filtroEstado === "Todos" || t.estado === filtroEstado;
    
    return coincideNombre && coincideEstado;
  });

  return (
    <div className="pacientes-container">
      <header className="pacientes-header-unified">
        <div className="header-title-group">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4A6741" strokeWidth="2.5">
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <h1>Historial de Turnos</h1>
            <p>Listado general de todas las sesiones programadas</p>
          </div>
        </div>
      </header>

      <div className="header-line"></div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="filtros-turnos" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Buscar paciente por nombre..." 
          className="agenda-date-picker"
          style={{ width: '300px' }}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        
        <select 
          className="agenda-date-picker"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="Todos">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Realizado">Realizado</option>
          <option value="Cancelado">Cancelado</option>
          <option value="Ausente">Ausente</option>
        </select>
      </div>

      <div className="tabla-wrapper animate-fade">
        <table className="pacientes-tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Paciente</th>
              <th>Profesional</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {turnosFiltrados.length > 0 ? turnosFiltrados.map(t => (
              <tr key={t._id}>
                <td>{new Date(t.fecha).toLocaleDateString('es-AR')}</td>
                <td className="font-bold">{t.hora} hs</td>
                <td>{t.paciente?.apellido.toUpperCase()}, {t.paciente?.nombre}</td>
                <td>{t.profesional?.apellido}</td>
                <td>
                  <span className={`estado-select ${t.estado.toLowerCase()}`} style={{ padding: '5px 10px', borderRadius: '5px' }}>
                    {t.estado}
                  </span>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '50px' }}>No se encontraron turnos</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TurnosGenerales;