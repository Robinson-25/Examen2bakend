require('dotenv').config();
const app = require('./app');
const { ensureDatabase } = require('./config/db');
const { sequelize } = require('./models');
const seed = require('./seed');

const PORT = process.env.PORT || 8080;

async function start() {
  if (!process.env.JWT_SECRET) throw new Error('Falta la variable JWT_SECRET');

  await ensureDatabase();      // crea bd_farmacia si no existe (local)
  await sequelize.authenticate();
  await sequelize.sync();      // crea las tablas y relaciones
  await seed();                // inserta los registros iniciales

  // Clever Cloud exige escuchar en 0.0.0.0:8080
  app.listen(PORT, '0.0.0.0', () => console.log(`Servidor listo en el puerto ${PORT}`));
}

start().catch((err) => {
  console.error('No se pudo iniciar el servidor:', err.message);
  process.exit(1);
});
