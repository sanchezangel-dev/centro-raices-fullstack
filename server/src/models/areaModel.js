const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre del área es obligatorio'],
        unique: true,
        trim: true 
    },
    activo: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Area', areaSchema);