🌿 Centro Raíces - Backend API
Sistema de gestión interna para el centro de salud y bienestar Centro Raíces. Esta API centraliza la administración de usuarios, pacientes, profesionales, planes de tratamiento y la configuración estructural de áreas.

🚀 Tecnologías Utilizadas
Node.js & Express: Servidor robusto y escalable.
MongoDB Atlas: Base de datos NoSQL en la nube.
Mongoose: Modelado de datos con validaciones y relaciones.
BcryptJS: Encriptación de alta seguridad para la gestión de credenciales.
UUID/Crypto: Generación de identificadores únicos para planes de tratamiento.

📁 Estructura del Proyecto
Plaintext
server/
 ├── src/
 │    ├── config/       # Configuración de base de datos (db.js)
 │    ├── controllers/  # Lógica de procesamiento de peticiones
 │    ├── helpers/      # Funciones auxiliares (handleControllerError)
 │    ├── middlewares/  # Validaciones y seguridad (authMiddleware.js)
 │    ├── models/       # Esquemas de Mongoose (User, Paciente, Turno, etc.)
 │    ├── routes/       # Definición de Endpoints
 │    ├── services/     # Lógica de negocio y consultas a la DB
 ├── .env               # Variables de entorno (DATABASE_URL, PORT)
 └── index.js           # Punto de entrada principal

🛠️ Endpoints Principales
🔐 Gestión de Usuarios y Seguridad (NUEVO)
POST /api/users/register: Registro de nuevo personal (Admin/Recepción).
POST /api/users/login: Inicio de sesión seguro con validación de credenciales.
GET /api/users: Lista completa del personal (Protegido: Solo Admin).
PUT /api/users/:id: Actualización de datos de usuario (Protegido: Solo Admin).
DELETE /api/users/:id: Eliminación física de cuenta (Protegido: Solo Admin).

👥 Gestión de Pacientes
GET /api/pacientes: Lista todos los pacientes activos.
GET /api/pacientes/dni/:dni: Busca un paciente por DNI para autocompletado.
POST /api/pacientes: Registra un nuevo paciente (soporte para Obra Social y CUD).
PUT /api/pacientes/:id: Actualiza la ficha del paciente.
DELETE /api/pacientes/:id: Baja lógica (activo: false) para preservar historial.

📅 Gestión de Turnos (Admisión y Planes)
GET /api/turnos?fecha=YYYY-MM-DD: Agenda del día con populate de pacientes y profesionales.
POST /api/turnos/admision: Registro de cita única.
POST /api/turnos/plan-tratamiento: Generación masiva de sesiones recurrentes vinculadas por planId.
PATCH /api/turnos/:id/estado: Cambia el estado (Realizado, Cancelado, Ausente).
DELETE /api/turnos/plan/:planId: Borrado lógico masivo de planes por error administrativo.

👩‍⚕️ Profesionales y Configuración
GET /api/profesionales: Lista especialistas con áreas vinculadas.
POST /api/profesionales: Registra un nuevo profesional.
GET /api/areas: Lista categorías (Psicología, Fonoaudiología, etc.).
POST /api/especialidades: Crea etiquetas vinculadas a un área.

🛡️ Seguridad (Middleware)
El sistema implementa un control de acceso basado en el header rol. Ciertas acciones sensibles (como el CRUD de usuarios) están restringidas exclusivamente al rol admin.