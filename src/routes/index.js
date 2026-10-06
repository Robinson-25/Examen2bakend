const { Router } = require('express');
const auth = require('../controllers/auth.controller');
const tipos = require('../controllers/tipoMedic.controller');
const medicamentos = require('../controllers/medicamento.controller');
const { User, Role } = require('../models');
const { verifyToken, hasRole } = require('../middlewares/authJwt');

const router = Router();

// --- Autenticación (público) ---
router.post('/auth/signup', auth.signup);
router.post('/auth/signin', auth.signin);

// --- CRUD protegido con JWT ---
// Leer: cualquier usuario con sesión | Crear y editar: moderator o admin | Eliminar: solo admin
const crud = (path, controller) => {
  router.get(path, verifyToken, controller.findAll);
  router.get(`${path}/:id`, verifyToken, controller.findOne);
  router.post(path, verifyToken, hasRole('moderator', 'admin'), controller.create);
  router.put(`${path}/:id`, verifyToken, hasRole('moderator', 'admin'), controller.update);
  router.delete(`${path}/:id`, verifyToken, hasRole('admin'), controller.remove);
};

crud('/tipos', tipos);
crud('/medicamentos', medicamentos);

// --- Usuarios (solo admin) ---
router.get('/users', verifyToken, hasRole('admin'), async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'createdAt'],
      include: { model: Role, as: 'roles', attributes: ['name'], through: { attributes: [] } },
      order: [['id', 'ASC']],
    });
    res.json(users.map((u) => ({ ...u.toJSON(), roles: u.roles.map((r) => r.name) })));
  } catch (err) { next(err); }
});

module.exports = router;
