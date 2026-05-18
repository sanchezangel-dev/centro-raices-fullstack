const mongoose = require('mongoose');

const profesionalSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    trim: true
  },
  dni: {
    type: String,
    required: [true, 'El DNI es obligatorio'],
    unique: true,
    trim: true
  },
  rol: {
    type: String,
    required: [true, 'El rol es obligatorio'],
    trim: true
  },
  // SOLUCIÓN CLAVE: Cambiamos 'correo' por 'email' para que coincida con tu Frontend
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true
  },
  telefono: {
    type: String,
    trim: true
  },
  esProfesionalSalud: {
    type: Boolean,
    default: false
  },
  matricula: {
    type: String,
    trim: true,
    required: function() { return this.esProfesionalSalud; }
  },
  area: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area', // Asegurate de que el modelo de áreas esté exportado como 'Area'
    required: function() { return this.esProfesionalSalud; }
  },
  especialidades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Especialidad' // Asegurate de que el modelo esté exportado como 'Especialidad'
  }],
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: 'creadoEn', updatedAt: 'actualizadoEn' }
});

module.exports = mongoose.model('Profesional', profesionalSchema);