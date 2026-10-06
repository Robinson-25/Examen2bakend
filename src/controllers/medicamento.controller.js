const { Medicamento, TipoMedic } = require('../models');

const includeTipo = { model: TipoMedic, as: 'tipo' };
const CAMPOS = [
  'descripcionMed', 'fechaFabricacion', 'fechaVencimiento', 'Presentacion',
  'stock', 'precioVentaUni', 'precioVentaPres', 'Marca', 'CodTipoMed',
];

// Solo se aceptan los campos permitidos del body
const pick = (body) => Object.fromEntries(CAMPOS.filter((c) => body[c] !== undefined).map((c) => [c, body[c]]));

async function tipoExiste(id) {
  return id !== undefined && (await TipoMedic.findByPk(id)) !== null;
}

exports.findAll = async (req, res, next) => {
  try {
    res.json(await Medicamento.findAll({ include: includeTipo, order: [['CodMedicamento', 'ASC']] }));
  } catch (err) { next(err); }
};

exports.findOne = async (req, res, next) => {
  try {
    const med = await Medicamento.findByPk(req.params.id, { include: includeTipo });
    if (!med) return res.status(404).json({ message: 'Medicamento no encontrado' });
    res.json(med);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const data = pick(req.body);
    if (!(await tipoExiste(data.CodTipoMed))) return res.status(400).json({ message: 'El tipo de medicamento no existe' });
    const med = await Medicamento.create(data);
    res.status(201).json(await med.reload({ include: includeTipo }));
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const med = await Medicamento.findByPk(req.params.id);
    if (!med) return res.status(404).json({ message: 'Medicamento no encontrado' });
    const data = pick(req.body);
    if (data.CodTipoMed !== undefined && !(await tipoExiste(data.CodTipoMed))) {
      return res.status(400).json({ message: 'El tipo de medicamento no existe' });
    }
    await med.update(data);
    res.json(await med.reload({ include: includeTipo }));
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const med = await Medicamento.findByPk(req.params.id);
    if (!med) return res.status(404).json({ message: 'Medicamento no encontrado' });
    await med.destroy();
    res.json({ message: 'Medicamento eliminado' });
  } catch (err) { next(err); }
};
