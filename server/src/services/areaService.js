const Area = require('../models/areaModel');

const crearArea = async (datos) => {
    return await Area.create(datos);
};

const obtenerTodas = async () => {
    return await Area.find({ activo: true });
};

const actualizarArea = async (id, data) => {
    return await Area.findByIdAndUpdate(id, data, { new: true });
};

const eliminarArea = async (id) => {
    return await Area.findByIdAndDelete(id);
};
module.exports = { 
    crearArea, 
    obtenerTodas, 
    actualizarArea,
    eliminarArea 
};
