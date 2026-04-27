const Turno = require('../models/turnoModel');
const crypto = require('crypto');

// 1. Crear un turno único (Admisión/Supervisión)
const crearTurnoIndividual = async (datos) => {
    try {
        const nuevoTurno = new Turno(datos);
        return await nuevoTurno.save();
    } catch (error) {
        if (error.code === 11000) throw new Error('El profesional ya tiene un turno en ese horario.');
        throw error;
    }
};

// 2. Generar Plan de Tratamiento (Sesiones automáticas)
const crearPlanTratamiento = async (datos) => {
    const { sesiones, fechaInicio, ...infoRestante } = datos;
    const planId = crypto.randomUUID(); 
    const turnosCreados = [];
    let fechaActual = new Date(fechaInicio);

    try {
        for (let i = 0; i < sesiones; i++) {
            const nuevoTurno = new Turno({
                ...infoRestante,
                fecha: new Date(fechaActual),
                tipoTurno: 'Tratamiento',
                planId
            });
            const guardado = await nuevoTurno.save();
            turnosCreados.push(guardado);

            fechaActual.setDate(fechaActual.getDate() + 7);
        }
        return turnosCreados;
    } catch (error) {
        throw new Error('Error al generar el plan: ' + error.message);
    }
};

// 3. Obtener turnos por fecha (Agenda diaria) o HISTORIAL (si fecha es null)
const obtenerTurnosPorFecha = async (fecha) => {
    let query = { estado: { $ne: 'Eliminado' } };

    // Solo si hay una fecha válida, filtramos por rango de día
    if (fecha) {
        const inicio = new Date(fecha);
        inicio.setHours(0, 0, 0, 0);
        const fin = new Date(fecha);
        fin.setHours(23, 59, 59, 999);
        
        query.fecha = { $gte: inicio, $lte: fin };
    }

    // Si fecha es null, query solo tendrá { estado: { $ne: 'Eliminado' } } 
    // y traerá todo el historial.
    return await Turno.find(query)
        .populate('paciente', 'nombre apellido')
        .populate('profesional', 'nombre apellido')
        .sort({ fecha: -1, hora: 1 }); // Ordenamos por más recientes primero
};

// 4. Actualizar datos específicos
const actualizarTurno = async (id, datosNuevos) => {
    try {
        return await Turno.findByIdAndUpdate(id, datosNuevos, { new: true, runValidators: true });
    } catch (error) {
        throw new Error('Error al actualizar el turno: ' + error.message);
    }
};

// 5. Cambiar estado rápido
const cambiarEstadoTurno = async (id, nuevoEstado) => {
    try {
        return await Turno.findByIdAndUpdate(id, { estado: nuevoEstado }, { new: true });
    } catch (error) {
        throw new Error('Error al cambiar el estado: ' + error.message);
    }
};

// 6. Borrado Lógico
const eliminarPlanLogico = async (planId) => {
    try {
        return await Turno.updateMany(
            { planId: planId }, 
            { estado: 'Eliminado' }
        );
    } catch (error) {
        throw new Error('Error al eliminar el plan: ' + error.message);
    }
};

module.exports = {
    crearTurnoIndividual,
    crearPlanTratamiento,
    obtenerTurnosPorFecha,
    actualizarTurno,
    cambiarEstadoTurno,
    eliminarPlanLogico
};