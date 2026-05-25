const turnoService = require('../services/turnoService');
const { handleControllerError } = require('../helpers/errorHelper'); 

const agendarAdmision = async (req, res) => {
    try {
        const turno = await turnoService.crearTurnoIndividual(req.body);
        res.status(201).json(turno);
    } catch (error) {
        handleControllerError(res, error); 
    }
};

const generarPlan = async (req, res) => {
    try {
        const turnos = await turnoService.crearPlanTratamiento(req.body);
        res.status(201).json({
            mensaje: `${turnos.length} sesiones agendadas correctamente`,
            planId: turnos[0].planId,
            turnos
        });
    } catch (error) {
        handleControllerError(res, error); 
    }
};

const listarPorDia = async (req, res) => {
    try {
        const { fecha } = req.query;

        // VALIDACIÓN: Si la fecha es basura o no viene, mandamos 'null' o 'undefined' 
        // para que el Service sepa que debe traer TODOS los turnos.
        const fechaValida = (fecha && fecha !== "undefined" && fecha !== "null" && fecha !== "") ? fecha : null;

        const turnos = await turnoService.obtenerTurnosPorFecha(fechaValida);
        
        // Retornamos siempre un array seguro para evitar fallas de lectura en el frontend (.map)
        res.status(200).json(turnos || []);
    } catch (error) {
        console.error("Error en listarPorDia:", error); // Log para debug en consola
        handleControllerError(res, error); 
    }
};

const editarTurno = async (req, res) => {
    try {
        const actualizado = await turnoService.actualizarTurno(req.params.id, req.body);
        if (!actualizado) return res.status(404).json({ mensaje: 'Turno no encontrado' });
        res.json(actualizado);
    } catch (error) {
        handleControllerError(res, error); 
    }
};

const cambiarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const actualizado = await turnoService.cambiarEstadoTurno(id, estado);
        res.json(actualizado);
    } catch (error) {
        handleControllerError(res, error); 
    }
};

const eliminarPlan = async (req, res) => {
    try {
        const { planId } = req.params;
        const resultado = await turnoService.eliminarPlanLogico(planId);
        res.json({ mensaje: `Se marcaron como eliminados ${resultado.modifiedCount} turnos.` });
    } catch (error) {
        handleControllerError(res, error); 
    }
};

module.exports = {
    agendarAdmision,
    generarPlan,
    listarPorDia,
    editarTurno,
    cambiarEstado,
    eliminarPlan
};