const { TipoMedic, Medicamento } = require('../models');

exports.findAll = async (req, res, next) => {
  try {
    res.json(await TipoMedic.findAll({ order: [['descripcion', 'ASC']] }));
  } catch (err) { next(err); }
};

exports.findOne = async (req, res, next) => {
  try {
    const tipo = await TipoMedic.findByPk(req.params.id, { include: { model: Medicamento, as: 'medicamentos' } });
    if (!tipo) return res.status(404).json({ message: 'Tipo no encontrado' });
    res.json(tipo);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const tipo = await TipoMedic.create({ descripcion: (req.body.descripcion || '').trim() });
    res.status(201).json(tipo);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const tipo = await TipoMedic.findByPk(req.params.id);
    if (!tipo) return res.status(404).json({ message: 'Tipo no encontrado' });
    await tipo.update({ descripcion: (req.body.descripcion || '').trim() });
    res.json(tipo);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const tipo = await TipoMedic.findByPk(req.params.id);
    if (!tipo) return res.status(404).json({ message: 'Tipo no encontrado' });
    const usados = await Medicamento.count({ where: { CodTipoMed: tipo.CodTipoMed } });
    if (usados > 0) {
      return res.status(409).json({ message: `No se puede eliminar: tiene ${usados} medicamento(s) asociado(s)` });
    }
    await tipo.destroy();
    res.json({ message: 'Tipo eliminado' });
  } catch (err) { next(err); }
};
