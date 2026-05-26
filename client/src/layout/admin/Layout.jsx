import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NotificacionProvider } from '../../context/NotificacionContext';

// Layouts
import AdminLayout from './AdminLayout';

// Pages
import Login from '../../pages/admin/Login';
import TurnosGenerales from '../../pages/admin/TurnosGenerales'; // Corregida la ruta
import Agenda from '../../pages/admin/Agenda';
import Pacientes from '../../pages/admin/Pacientes';
import Professionals from '../../pages/admin/Professionals';
import Especialidades from '../../pages/admin/Especialidades';
import Usuarios from '../../pages/admin/Usuarios';

const AppRouter = () => {
  return (
    <NotificacionProvider>
      <BrowserRouter>
        <Routes>
          {/* La puerta de entrada es el Login */}
          <Route path="/login" element={<Login />} />

          {/* Si entran a la raíz, los mandamos al login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Rutas de Administración Protegidas */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* CAMBIO CLAVE: Al entrar a /admin, te redirige automáticamente a la Agenda */}
            <Route index element={<Navigate to="/admin/agenda" />} />

            <Route path="agenda" element={<Agenda />} />
            <Route path="turnos" element={<TurnosGenerales />} /> {/* Nueva ruta para el historial */}
            <Route path="pacientes" element={<Pacientes />} />
            <Route path="profesionales" element={<Professionals />} />
            <Route path="especialidades" element={<Especialidades />} />
            <Route path="usuarios" element={<Usuarios />} />
          </Route>

          {/* Redirección por si escriben cualquier cosa mal */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </NotificacionProvider>
  );
};

export default AppRouter;