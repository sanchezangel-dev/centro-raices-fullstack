import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Modal from '../../components/admin/Modal';
import '../../styles/admin/Usuarios.css'; // Descomentá cuando tengas el CSS listo

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Estado inicial corregido para que coincida con el Enum del Backend
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: 'recepcionista'
    });

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            // Gracias al interceptor en axios.js, esto ya envía el token automáticamente
            const res = await api.get('/users');
            setUsuarios(res.data);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            if (error.response?.status === 403) {
                alert("No tenés permisos para ver esta sección o tu sesión expiró.");
            }
        } finally {
            setLoading(false);
        }
    };

    const abrirModal = () => {
        // CORRECCIÓN: Reseteamos a 'recepcionista' para evitar errores de validación
        setFormData({ nombre: '', email: '', password: '', rol: 'recepcionista' });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/register', formData);
            setIsModalOpen(false);
            fetchUsuarios(); // Recargamos la lista
        } catch (error) {
            const mensajeError = error.response?.data?.mensaje || error.message;
            console.log("Error detallado del servidor:", error.response?.data);
            alert("Error al crear usuario: " + mensajeError);
        }
    };

    const handleEliminar = async (id, nombre, rol) => {
        if (rol === 'admin') {
            return alert("No podés eliminar a un administrador por seguridad.");
        }

        if (window.confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsuarios();
            } catch (error) {
                alert("No se pudo eliminar el usuario.");
            }
        }
    };

    if (loading) return (
        <div className="admin-page">
            <p><i className="fas fa-spinner fa-spin"></i> Cargando panel de control...</p>
        </div>
    );

    return (
        <div className="usuarios-container">
            <header className="header-config">
                <h2><i className="fas fa-users-cog"></i> Gestión de Usuarios</h2>
                <button className="btn-main-add" onClick={abrirModal}>
                    <i className="fas fa-user-plus"></i> Nuevo Usuario
                </button>
            </header>

            <div className="table-responsive">
                <table className="usuarios-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(user => (
                            <tr key={user._id}>
                                <td>
                                    <i className="fas fa-user-circle" style={{ color: '#2d5a27', marginRight: '10px' }}></i>
                                    {user.nombre}
                                </td>
                                <td>
                                    <i className="fas fa-envelope" style={{ color: '#666', marginRight: '10px', fontSize: '0.9em' }}></i>
                                    {user.email}
                                </td>
                                <td>
                                    <span className={`badge ${user.rol}`}>
                                        <i className={user.rol === 'admin' ? 'fas fa-user-shield' : 'fas fa-user-tag'} style={{ marginRight: '5px' }}></i>
                                        {user.rol === 'admin' ? 'Administrador' : 'Recepcionista'}
                                    </span>
                                </td>
                                <td>
                                    {user.rol !== 'admin' && (
                                        <button
                                            className="btn-delete-user"
                                            onClick={() => handleEliminar(user._id, user.nombre, user.rol)}
                                        >
                                            <i className="fas fa-trash-alt"></i> Eliminar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Dar de Alta Nuevo Usuario"
            >
                <form onSubmit={handleGuardar} className="modal-form">
                    <div className="form-group">
                        <label>Nombre Completo:</label>
                        <input
                            type="text"
                            name="nombre"
                            className="modal-input"
                            placeholder="Ej: Martín Palermo"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            className="modal-input"
                            placeholder="correo@centroraices.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña Provisional:</label>
                        <input
                            type="password"
                            name="password"
                            className="modal-input"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Rol del Sistema:</label>
                        <select
                            name="rol"
                            className="modal-input"
                            value={formData.rol}
                            onChange={handleInputChange}
                        >
                            <option value="recepcionista">Recepcionista</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                        <button type="submit" className="btn-confirm">Crear Usuario</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Usuarios;