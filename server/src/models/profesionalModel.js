const mongoose = require('mongoose');

const profesionalSchema = new mongoose.Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
    apellido: { type: String, required: [true, 'El apellido es obligatorio'], trim: true },
    dni: { type: String, required: [true, 'El DNI es obligatorio'], unique: true, trim: true },
    rol: { type: String, trim: true, default: "Staff General" },
    email: { type: String, lowercase: true, trim: true, default: "" },
    telefono: { type: String, default: "" },
    esProfesionalSalud: { type: Boolean, default: false },
    matricula: { type: String, trim: true, default: "" },
    tipoTitulo: { type: String, trim: true, default: "" },
    enfoque: { type: String, trim: true, default: "" },
    activo: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Profesional', profesionalSchema);