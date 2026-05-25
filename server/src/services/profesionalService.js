const Profesional = require('../models/profesionalModel');

const crearProfesional = async (datos) => {
  try {
    const nuevo = new Profesional(datos);
    const guardado = await nuevo.save();
    // Poblamos el objeto recién creado para que el Front lo reciba perfecto de entrada
    return await Profesional.findById(guardado._id).populate('area').populate('especialidades');
  } catch (error) {
    if (error.code === 11000) throw new Error('El DNI o el Correo electrónico ya existe');
    throw error;
  }
};

const obtenerTodos = async () => {
  try {
    return await Profesional.find({})
      .populate('area')
      .populate('especialidades')
      .sort({ apellido: 1 });
  } catch (error) {
    throw new Error('Error al obtener la lista de profesionales: ' + error.message);
  }
};

const obtenerPorId = async (id) => {
  try {
    const profesional = await Profesional.findById(id)
      .populate('area')
      .populate('especialidades');
      
    if (!profesional) throw new Error('No encontrado');
    return profesional;
  } catch (error) {
    throw error;
  }
};

const actualizarProfesional = async (id, datosNuevos) => {
  try {
    // Buscamos, editamos y poblamos de una sola vez
    return await Profesional.findByIdAndUpdate(id, datosNuevos, { 
      new: true, 
      runValidators: true 
    })
    .populate('area')
    .populate('especialidades');
  } catch (error) {
    throw error;
  }
};

const eliminarProfesional = async (id) => {
  try {
    return await Profesional.findByIdAndUpdate(id, { activo: false }, { new: true });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  crearProfesional,
  obtenerTodos,
  obtenerPorId,
  actualizarProfesional,
  eliminarProfesional
};