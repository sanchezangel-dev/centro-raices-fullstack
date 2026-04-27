const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
    apellido: { type: String, required: [true, 'El apellido es obligatorio'], trim: true },
    dni: { type: Number, required: [true, 'El DNI es obligatorio'], unique: true },
    fechaNacimiento: { type: Date },
    telefono: { type: String },
    email: { type: String, trim: true, lowercase: true },
    poseeObraSocial: { type: Boolean, default: false },
    obraSocial: { type: String, trim: true },
    nroAfiliado: { type: String, trim: true },
    poseeCUD: { type: Boolean, default: false },
    nroCUD: { type: String, trim: true },
    vencimientoCUD: { type: Date },
    // NUEVOS CAMPOS AGREGADOS:
    cudDiagnostico: { type: String, trim: true },
    cudDescripcion: { type: String, trim: true },
    notas: { type: String },
    activo: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Paciente', pacienteSchema);