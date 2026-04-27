const mongoose = require('mongoose');

const turnoSchema = new mongoose.Schema({
    paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Paciente',
        required: true
    },
    profesional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profesional',
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    hora: {
        type: String, // Ejemplo: "15:30"
        required: true,
        trim: true
    },
    tipoTurno: {
        type: String,
        enum: ['Admisión', 'Tratamiento', 'Supervisión'],
        default: 'Admisión'
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'Realizado', 'Cancelado', 'Ausente', 'Eliminado'], 
        default: 'Pendiente'
    },
    planId: { 
        type: String, // Para agrupar sesiones de un mismo plan
        default: null 
    },
    notas: {
        type: String,
        trim: true
    }
}, { 
    timestamps: true 
});

// ÍNDICE ÚNICO: Evita que un profesional tenga dos turnos el mismo día a la misma hora
// Esto es lo que causaba el error 11000 que manejamos en el Service.
turnoSchema.index({ profesional: 1, fecha: 1, hora: 1 }, { unique: true });

module.exports = mongoose.model('Turno', turnoSchema);