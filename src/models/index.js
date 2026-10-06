const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Role = require('./role.model')(sequelize, DataTypes);
const User = require('./user.model')(sequelize, DataTypes);
const TipoMedic = require('./tipoMedic.model')(sequelize, DataTypes);
const Medicamento = require('./medicamento.model')(sequelize, DataTypes);

// --- Relaciones ---
// Usuarios <-> Roles (muchos a muchos)
User.belongsToMany(Role, { through: 'user_roles', as: 'roles', foreignKey: 'userId' });
Role.belongsToMany(User, { through: 'user_roles', as: 'users', foreignKey: 'roleId' });

// TipoMedic 1 --- N Medicamento
TipoMedic.hasMany(Medicamento, { foreignKey: 'CodTipoMed', as: 'medicamentos', onDelete: 'RESTRICT' });
Medicamento.belongsTo(TipoMedic, { foreignKey: 'CodTipoMed', as: 'tipo' });

const ROLES = ['user', 'moderator', 'admin'];

module.exports = { sequelize, Role, User, TipoMedic, Medicamento, ROLES };
