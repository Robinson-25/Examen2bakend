module.exports = (sequelize, DataTypes) =>
  sequelize.define('Medicamento', {
    CodMedicamento: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    descripcionMed: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { notEmpty: { msg: 'La descripción es obligatoria' } },
    },
    fechaFabricacion: { type: DataTypes.DATEONLY, allowNull: false },
    fechaVencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        posteriorAFabricacion(value) {
          if (this.fechaFabricacion && value <= this.fechaFabricacion) {
            throw new Error('La fecha de vencimiento debe ser posterior a la de fabricación');
          }
        },
      },
    },
    Presentacion: { type: DataTypes.STRING(80), allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0 } },
    precioVentaUni: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
    precioVentaPres: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
    Marca: { type: DataTypes.STRING(80), allowNull: false },
    CodTipoMed: { type: DataTypes.INTEGER, allowNull: false },
  }, { tableName: 'Medicamento', timestamps: false });
