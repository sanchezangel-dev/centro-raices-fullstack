import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  
  // Recuperamos el nombre que guardamos en el login
  const userNombre = localStorage.getItem('userNombre') || 'Usuario';

  const handleLogout = () => {
    // 1. Borramos absolutamente todo del almacenamiento local
    localStorage.clear();
    
    // 2. En lugar de usar navigate, usamos window.location.href
    // Esto fuerza al navegador a recargar la página desde cero,
    // limpiando cualquier estado de React que haya quedado del usuario anterior.
    window.location.href = '/login';
    
    console.log("Sesión cerrada y estado limpiado");
  };

  return (
    <nav className="admin-navbar">
      <div className="navbar-user-info">
        <i className="fas fa-user-circle"></i>
        <span>Hola, <strong>{userNombre}</strong> </span>
      </div>

      <button className="btn-logout-top" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
      </button>
    </nav>
  );
};

export default Navbar;