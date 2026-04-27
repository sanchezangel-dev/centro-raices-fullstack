const userService = require('../services/userService');
const { handleControllerError } = require('../helpers/errorHelper');
const { generarJWT } = require('../helpers/jwtHelper'); 

const registrar = async (req, res) => {
    try {
        const usuario = await userService.registrar(req.body);
        const usuarioObjetivo = usuario.toObject();
        delete usuarioObjetivo.password;
        res.status(201).json(usuarioObjetivo);
    } catch (error) {
        handleControllerError(res, error);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await userService.login(email, password);
        
        const token = generarJWT(usuario._id);
        
        res.status(200).json({
            mensaje: "Login exitoso",
            token,
            user: {
                id: usuario._id,
                nombre: usuario.nombre,
                rol: usuario.rol
            }
        });
    } catch (error) {
        handleControllerError(res, error);
    }
};

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await userService.obtenerTodos();
        res.status(200).json(usuarios);
    } catch (error) {
        handleControllerError(res, error);
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioActualizado = await userService.actualizar(id, req.body);
        res.status(200).json(usuarioActualizado);
    } catch (error) {
        handleControllerError(res, error);
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await userService.eliminar(id);
        res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
        handleControllerError(res, error);
    }
};

module.exports = { 
    registrar, 
    login, 
    obtenerUsuarios, 
    actualizarUsuario, 
    eliminarUsuario 
};