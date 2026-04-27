const mongoose = require('mongoose');

const especialidadSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre de la especialidad es obligatorio'],
        trim: true 
    },
    area: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Area', 
        required: [true, 'La especialidad debe pertenecer a un área'] 
    },
    activo: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Especialidad', especialidadSchema);