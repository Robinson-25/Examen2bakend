const bcrypt = require('bcryptjs');
const { Role, User, TipoMedic, Medicamento, ROLES } = require('./models');

// Inserta los registros iniciales usando Sequelize (solo si las tablas están vacías)
module.exports = async function seed() {
  for (const name of ROLES) await Role.findOrCreate({ where: { name } });

  if ((await User.count()) === 0) {
    const cuentas = [
      { username: 'admin', email: 'admin@farmacia.com', password: 'admin123', roles: ['admin'] },
      { username: 'moderador', email: 'moderador@farmacia.com', password: 'mod123', roles: ['moderator'] },
      { username: 'usuario', email: 'usuario@farmacia.com', password: 'user123', roles: ['user'] },
    ];
    for (const c of cuentas) {
      const user = await User.create({ ...c, password: await bcrypt.hash(c.password, 10) });
      await user.setRoles(await Role.findAll({ where: { name: c.roles } }));
    }
  }

  if ((await TipoMedic.count()) === 0) {
    await TipoMedic.bulkCreate(
      ['Analgésico', 'Antibiótico', 'Antiinflamatorio', 'Antialérgico'].map((descripcion) => ({ descripcion })),
    );
    const cod = async (descripcion) => (await TipoMedic.findOne({ where: { descripcion } })).CodTipoMed;
    const [analgesico, antibiotico, antiinflamatorio, antialergico] = [
      await cod('Analgésico'), await cod('Antibiótico'), await cod('Antiinflamatorio'), await cod('Antialérgico'),
    ];

    await Medicamento.bulkCreate([
      { descripcionMed: 'Paracetamol 500 mg', fechaFabricacion: '2026-01-15', fechaVencimiento: '2028-01-15', Presentacion: 'Caja x 100 tabletas', stock: 250, precioVentaUni: 0.2, precioVentaPres: 15, Marca: 'Genfar', CodTipoMed: analgesico },
      { descripcionMed: 'Amoxicilina 500 mg', fechaFabricacion: '2026-02-10', fechaVencimiento: '2028-02-10', Presentacion: 'Caja x 100 cápsulas', stock: 120, precioVentaUni: 0.5, precioVentaPres: 40, Marca: 'Portugal', CodTipoMed: antibiotico },
      { descripcionMed: 'Ibuprofeno 400 mg', fechaFabricacion: '2026-03-05', fechaVencimiento: '2028-03-05', Presentacion: 'Caja x 100 tabletas', stock: 180, precioVentaUni: 0.3, precioVentaPres: 25, Marca: 'Farmindustria', CodTipoMed: antiinflamatorio },
      { descripcionMed: 'Loratadina 10 mg', fechaFabricacion: '2026-01-20', fechaVencimiento: '2027-12-20', Presentacion: 'Caja x 100 tabletas', stock: 90, precioVentaUni: 0.4, precioVentaPres: 30, Marca: 'Medifarma', CodTipoMed: antialergico },
      { descripcionMed: 'Azitromicina 500 mg', fechaFabricacion: '2026-04-01', fechaVencimiento: '2028-04-01', Presentacion: 'Caja x 3 tabletas', stock: 60, precioVentaUni: 3.5, precioVentaPres: 9.9, Marca: 'Genfar', CodTipoMed: antibiotico },
    ]);
  }
};
