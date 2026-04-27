import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Modal from '../../components/admin/Modal';
import '../../styles/admin/Especialidades.css';

const Especialidades = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', type: '', areaId: null });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetchDatos();
  }, []);

  const fetchDatos = async () => {
    try {
      setLoading(true);
      const resAreas = await api.get('/areas');
      const resEsps = await api.get('/especialidades');

      // Agrupamos especialidades dentro de sus áreas correspondientes
      const datosAgrupados = resAreas.data.map(area => {
        const especialidadesDeEstaArea = resEsps.data.filter(esp => {
          const idAreaEnEsp = esp.area?._id || esp.area;
          return idAreaEnEsp === area._id;
        });

        return {
          ...area,
          items: especialidadesDeEstaArea
        };
      });

      setAreas(datosAgrupados);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalArea = () => {
    setModalConfig({ title: 'Nueva Área', type: 'AREA', areaId: null });
    setInputValue('');
    setIsModalOpen(true);
  };

  const abrirModalEspecialidad = (areaId, areaNombre) => {
    setModalConfig({ title: `Nueva Especialidad para ${areaNombre}`, type: 'ESP', areaId });
    setInputValue('');
    setIsModalOpen(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const nombreMayus = inputValue.trim().toUpperCase();

    // --- 1. VALIDACIÓN PREVENTIVA (FRONTEND) ---
    if (modalConfig.type === 'AREA') {
      const existeArea = areas.some(a => a.nombre.toUpperCase() === nombreMayus);
      if (existeArea) {
        return alert(`¡Atención! El área "${nombreMayus}" ya existe.`);
      }
    } else {
      const areaActual = areas.find(a => a._id === modalConfig.areaId);
      const existeEsp = areaActual?.items?.some(esp => esp.nombre.toUpperCase() === nombreMayus);
      
      if (existeEsp) {
        return alert(`¡Error! La especialidad "${nombreMayus}" ya existe dentro de ${areaActual.nombre}.`);
      }
    }

    // --- 2. ENVÍO AL BACKEND ---
    try {
      if (modalConfig.type === 'AREA') {
        await api.post('/areas', { nombre: nombreMayus });
      } else {
        await api.post('/especialidades', {
          nombre: nombreMayus,
          area: modalConfig.areaId
        });
      }
      
      setIsModalOpen(false);
      setInputValue('');
      fetchDatos(); 
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Error: El registro ya existe en la base de datos.");
      } else {
        console.error("Error al guardar:", error);
        alert("Hubo un problema al guardar. Intentá de nuevo.");
      }
    }
  };

  const eliminarEspecialidad = async (espId, nombre) => {
    if (window.confirm(`¿Seguro que querés eliminar "${nombre}"?`)) {
      try {
        await api.delete(`/especialidades/${espId}`);
        fetchDatos();
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("No se pudo eliminar la especialidad.");
      }
    }
  };

  const eliminarArea = async (areaId, nombre) => {
    if (window.confirm(`¿Eliminar el área "${nombre}" y todas sus especialidades?`)) {
      try {
        await api.delete(`/areas/${areaId}`);
        fetchDatos();
      } catch (error) {
        console.error("Error al eliminar área:", error);
        alert("No se pudo eliminar el área.");
      }
    }
  };

  if (loading) return <div className="admin-page"><p>Cargando configuración...</p></div>;

  return (
    <div className="especialidades-container">
      <header className="header-config">
        <h2><i className="fas fa-stethoscope"></i> Configuración de Áreas</h2>
        <button className="btn-main-add" onClick={abrirModalArea}>
          <i className="fas fa-plus"></i> Crear Nueva Área
        </button>
      </header>

      <div className="cards-grid">
        {areas.map(area => (
          <div key={area._id} className="area-card">
            <div className="card-header-actions">
              <h3>{area.nombre}</h3>
              <button className="btn-delete-area" onClick={() => eliminarArea(area._id, area.nombre)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="tags-container">
              {area.items.map((item) => (
                <span key={item._id} className="tag">
                  {item.nombre}
                  <button
                    className="btn-delete-tag"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      eliminarEspecialidad(item._id, item.nombre);
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <button className="btn-add-tag" onClick={() => abrirModalEspecialidad(area._id, area.nombre)}>
              <i className="fas fa-plus-circle"></i> Agregar Especialidad
            </button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalConfig.title}
      >
        <form onSubmit={handleGuardar} className="modal-form">
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              className="modal-input"
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribí aquí..."
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
            <button type="submit" className="btn-confirm">Guardar Cambios</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Especialidades;