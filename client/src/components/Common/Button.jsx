import React from 'react';
import '../../styles/common/Buttons.css'; // Asegúrate de ajustar esta ruta

const Button = ({ children, onClick, variant = 'primary', type = 'button' }) => {
  // variant puede ser 'primary' o 'secondary'
  return (
    <button 
      type={type} 
      className={`btn-admin btn-${variant}`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;