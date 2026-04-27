import React, { useState } from 'react';
import '../../styles/admin/Pacientes.css';

const FilaPaciente = ({ paciente }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <tr className={`fila-principal ${isExpanded ? 'row-expanded' : ''}`}>
        <td className="font-bold">{paciente.apellido}, {paciente.nombre}</td>
        <td>{paciente.dni}</td>
        
        {/* RESUMEN DE TURNO */}
        <td>
          {paciente.turnos && paciente.turnos.length > 0 ? (
            <div className="turno-tag">
              <strong>{paciente.turnos[0].fecha}</strong><br/>
              <small>{paciente.turnos[0].hora} hs</small>
              {paciente.turnos.length > 1 && (
                <span className="mas-turnos"> (+{paciente.turnos.length - 1})</span>
              )}
            </div>
          ) : (
            <span className="no-turno">Sin turnos</span>
          )}
        </td>

        <td>
          <span className={`badge ${paciente.activo ? 'activo' : 'inhabilitado'}`}>
            {paciente.activo ? 'Activo' : 'Inhabilitado'}
          </span>
        </td>

        {/*<td className="actions-cell">
          <button className="btn-action btn-view" onClick={() => setIsExpanded(!isExpanded)}>
            <i className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-eye'}`}></i>
          </button>
          <button className="btn-action btn-edit"><i className="fas fa-edit"></i></button>
          <button className="btn-action btn-delete"><i className="fas fa-user-slash"></i></button>
        </td>
      */}

<td className="actions-cell">
     {/*<button className="action-btn view" title="Ver ficha completa">*/}
               <button className="action-btn view" title="Ver ficha completa" onClick={() => setIsExpanded(!isExpanded)}>
        <i className="fas fa-eye"></i>
    </button>
    <button className="action-btn edit" title="Editar datos">
        <i className="fas fa-edit"></i>
    </button>
    <button className="action-btn delete" title="Dar de baja">
        <i className="fas fa-user-slash"></i>
    </button>
</td>
</tr>
      {/* DESGLOSE (Ficha completa) */}
      {isExpanded && (
        <tr className="fila-detalle-info">
          <td colSpan="5">
            <div className="detalle-expandido">
              <div className="grid-detalle">
                <div className="col-detalle">
                  <h5><i className="fas fa-file-medical"></i> Cobertura</h5>
                  <p><strong>OS:</strong> {paciente.obraSocial.nombre || 'Particular'}</p>
                  <p><strong>CUD:</strong> {paciente.cud.poseeCud ? 'Sí' : 'No'}</p>
                </div>
                <div className="col-detalle">
                  <h5><i className="fas fa-address-book"></i> Contacto</h5>
                  <p><strong>Tel:</strong> {paciente.celular}</p>
                  {paciente.apoderado.nombre && <p><strong>Apoderado:</strong> {paciente.apoderado.nombre}</p>}
                </div>
                <div className="col-detalle">
                  <h5><i className="fas fa-clock"></i> Todos los Turnos</h5>
                  <ul className="lista-turnos-detalle">
                    {paciente.turnos.map((t, i) => <li key={i}>{t.fecha} - {t.hora}hs</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const TablaPacientes = ({ pacientes }) => (
  <table className="tabla-admin">
    <thead>
      <tr>
        <th>Paciente</th>
        <th>DNI</th>
        <th>Próximo Turno</th>
        <th>Estado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {pacientes.map(p => <FilaPaciente key={p.dni} paciente={p} />)}
    </tbody>
  </table>
);

export default TablaPacientes;