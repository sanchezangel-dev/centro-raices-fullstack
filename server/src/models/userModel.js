const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 6, 
        select: false 
    },
    rol: { 
        type: String, 
        enum: ['admin', 'recepcionista'], 
        default: 'recepcionista' 
    },
    activo: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

// Método para comparar contraseñas
userSchema.methods.compararPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);