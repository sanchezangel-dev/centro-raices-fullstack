import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Modal from '../../components/admin/Modal'; // Aseguramos que la ruta sea correcta
import '../../styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // --- NUEVOS ESTADOS PARA EL RESET ---
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [resetLoading, setResetLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            localStorage.clear();

            const response = await api.post('/users/login', { email, password });
            console.log("DATOS DEL USUARIO:", response.data.user);
            
            if (response.data.user && response.data.token) {
                // Guardamos TODO primero
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userNombre', response.data.user.nombre);
                localStorage.setItem('userRol', response.data.user.rol);
                localStorage.setItem('userId', response.data.user.id);
                
                // --- LA LLAVE DE SEGURIDAD ---
                // Si el backend dice que debe cambiarla, abrimos el modal y NO navegamos
                if (response.data.user.debeCambiarPassword) {
                    setIsResetModalOpen(true);
                    setLoading(false);
                } else {
                    navigate('/admin');
                }
            } else {
                setError('Error en la respuesta del servidor (Falta token)');
            }
        } catch (err) {
            setError(err.response?.data?.mensaje || 'Credenciales inválidas');
            setLoading(false);
        }
    };

    // --- FUNCIÓN PARA GUARDAR LA NUEVA CONTRASEÑA ---
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (nuevaPassword !== confirmarPassword) {
            return alert("Las contraseñas no coinciden");
        }
        if (nuevaPassword.length < 6) {
            return alert("La contraseña debe tener al menos 6 caracteres");
        }

        setResetLoading(true);
        try {
            await api.put('/users/update-password', { nuevaPassword });
            
            alert("¡Contraseña actualizada con éxito! Ya podés ingresar.");
            setIsResetModalOpen(false);
            navigate('/admin'); 
        } catch (err) {
            alert(err.response?.data?.mensaje || "Error al actualizar la contraseña");
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <i className="fas fa-leaf login-icon-top"></i>
                    <h1 className="brand-title">Centro Raíces</h1>
                    <p>Gestión de Bienestar</p>
                </div>

                {error && (
                    <div className="error-badge">
                        <i className="fas fa-exclamation-circle"></i> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-field">
                        <i className="fas fa-envelope"></i>
                        <input 
                            type="email" 
                            placeholder="Correo electrónico" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="input-field">
                        <i className="fas fa-lock"></i>
                        <input 
                            type="password" 
                            placeholder="Contraseña" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? 'Ingresando...' : (
                            <>
                                Ingresar <i className="fas fa-arrow-right"></i>
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* --- MODAL DE CAMBIO OBLIGATORIO --- */}
            <Modal 
                isOpen={isResetModalOpen} 
                onClose={() => {}} // Bloqueamos el cierre manual para obligar al cambio
                title="Actualizar Contraseña Provisoria"
            >
                <form onSubmit={handleUpdatePassword} className="modal-form">
                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                        Por seguridad, debes cambiar la contraseña provisoria antes de continuar.
                    </p>
                    <div className="form-group">
                        <label>Nueva Contraseña:</label>
                        <input 
                            type="password" 
                            className="modal-input"
                            value={nuevaPassword}
                            onChange={(e) => setNuevaPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirmar Nueva Contraseña:</label>
                        <input 
                            type="password" 
                            className="modal-input"
                            value={confirmarPassword}
                            onChange={(e) => setConfirmarPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="modal-actions">
                        <button 
                            type="submit" 
                            className="btn-confirm" 
                            disabled={resetLoading}
                        >
                            {resetLoading ? 'Guardando...' : 'Actualizar y Entrar'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Login;