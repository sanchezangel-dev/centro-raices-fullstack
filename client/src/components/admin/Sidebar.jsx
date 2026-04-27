import { Link } from 'react-router-dom';
import '../../styles/admin/Sidebar.css';

const Sidebar = () => {
  // Obtenemos el rol guardado en el login
  const userRol = localStorage.getItem('userRol');

  return (
    <aside className="sidebar-container">
      <h2 className="sidebar-title">Centro Raíces</h2>
      
      <nav className="sidebar-nav">
        {/* Eliminamos Panel y dejamos Agenda como primera opción */}
        <Link to="/admin/agenda" className="sidebar-link">
          <i className="fas fa-calendar-alt"></i> Agenda
        </Link>

        {/* NUEVA OPCIÓN: Historial de Turnos */}
        <Link to="/admin/turnos" className="sidebar-link">
          <i className="fas fa-list-ul"></i> Turnos
        </Link>

        <Link to="/admin/pacientes" className="sidebar-link">
          <i className="fas fa-user-injured"></i> Pacientes
        </Link>

        {/* 🛡️ SECCIÓN EXCLUSIVA PARA ADMINISTRADORES */}
        {/* Agregamos toLowerCase() para que no falle si en la DB dice "Admin" o "admin" */}
        {(userRol?.toLowerCase() === 'admin' || userRol === 'Administrador') && (
          <>
            <div className="sidebar-divider"></div> 
            <Link to="/admin/profesionales" className="sidebar-link">
              <i className="fas fa-user-md"></i> Profesionales
            </Link>
            <Link to="/admin/especialidades" className="sidebar-link">
              <i className="fas fa-stethoscope"></i> Especialidades
            </Link>
            <Link to="/admin/usuarios" className="sidebar-link">
              <i className="fas fa-users-cog"></i> Usuarios
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;