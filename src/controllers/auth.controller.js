const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, Role } = require('../models');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/signup
exports.signup = async (req, res, next) => {
  try {
    const username = (req.body.username || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (username.length < 3) return res.status(400).json({ message: 'El usuario debe tener al menos 3 caracteres' });
    if (!emailRegex.test(email)) return res.status(400).json({ message: 'Correo no válido' });
    if (password.length < 6) return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });

    const exists = await User.findOne({ where: { [Op.or]: [{ username }, { email }] } });
    if (exists) return res.status(400).json({ message: 'El usuario o correo ya está registrado' });

    const user = await User.create({ username, email, password: await bcrypt.hash(password, 10) });

    // Todo registro público recibe el rol "user".
    // Los roles admin/moderator se asignan desde el seed (o directamente en la BD).
    const role = await Role.findOne({ where: { name: 'user' } });
    await user.setRoles([role]);

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/signin
exports.signin = async (req, res, next) => {
  try {
    const { username = '', password = '' } = req.body;
    const user = await User.findOne({
      where: { username: username.trim() },
      include: { model: Role, as: 'roles', through: { attributes: [] } },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const roles = user.roles.map((r) => r.name);
    const accessToken = jwt.sign({ id: user.id, roles }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });

    res.json({ id: user.id, username: user.username, email: user.email, roles, accessToken });
  } catch (err) {
    next(err);
  }
};
