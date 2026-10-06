// Manejo centralizado de errores (incluye los errores de Sequelize)
module.exports = (err, req, res, next) => {
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const unique = err.name === 'SequelizeUniqueConstraintError';
    return res.status(400).json({
      message: unique ? 'Ya existe un registro con ese valor' : err.errors.map((e) => e.message).join('. '),
    });
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({ message: 'El registro está relacionado con otros datos' });
  }
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
};
