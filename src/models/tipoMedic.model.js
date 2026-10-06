module.exports = (sequelize, DataTypes) =>
  sequelize.define('TipoMedic', {
    CodTipoMed: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    descripcion: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'La descripción es obligatoria' } },
    },
  }, { tableName: 'TipoMedic', timestamps: false });
