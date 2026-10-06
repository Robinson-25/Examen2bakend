module.exports = (sequelize, DataTypes) =>
  sequelize.define('Role', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  }, { tableName: 'roles', timestamps: false });
