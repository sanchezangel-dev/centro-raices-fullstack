import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import Navbar from '../../components/admin/Navbar';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      {/* Columna Izquierda: Sidebar */}
      <div style={{ width: '250px', flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Columna Derecha: Navbar + Contenido */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ padding: '30px', backgroundColor: '#f9fbf9', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;