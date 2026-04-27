import React, { useState } from 'react';
//import Button from '../../components/Common/Button'; // Ajusta la ruta a tu carpeta Common
import Button from '../../../components/Common/Button';
import '../../../styles/admin/NuevoTurnoModal.css';

const NuevoTurnoModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({ paciente: '', especialidad: '', profesional: '', fecha: '', hora: '' });

  // Simulación de datos (esto vendrá de tu BD)
  const especialidades = [
    { nombre: 'Psicología', profesionales: ['Lic. García', 'Lic. López'] },
    { nombre: 'Nutrición', profesionales: ['Lic. Martínez', 'Lic. Rodríguez'] }
  ];

  // Obtener profesionales según especialidad elegida
  const profesionales = especialidades.find(e => e.nombre === formData.especialidad)?.profesionales || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Agendar Nuevo Turno</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <input type="text" placeholder="Nombre del Paciente" required onChange={(e) => setFormData({...formData, paciente: e.target.value})} />
          
          <select required onChange={(e) => setFormData({...formData, especialidad: e.target.value, profesional: ''})}>
            <option value="">Seleccione Especialidad</option>
            {especialidades.map(esp => <option key={esp.nombre} value={esp.nombre}>{esp.nombre}</option>)}
          </select>

          <select required disabled={!formData.especialidad} onChange={(e) => setFormData({...formData, profesional: e.target.value})}>
            <option value="">Seleccione Profesional</option>
            {profesionales.map(prof => <option key={prof} value={prof}>{prof}</option>)}
          </select>

          <div className="row-inputs">
            <input type="date" required onChange={(e) => setFormData({...formData, fecha: e.target.value})} />
            <input type="time" min="09:00" max="19:00" required onChange={(e) => setFormData({...formData, hora: e.target.value})} />
          </div>
          
          <div className="modal-actions">
            <Button variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="primary">Guardar Turno</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoTurnoModal;