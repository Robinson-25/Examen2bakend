const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

// Clever Cloud entrega estas variables automáticamente al enlazar el add-on MySQL.
const config = {
  host: process.env.MYSQL_ADDON_HOST || 'localhost',
  port: Number(process.env.MYSQL_ADDON_PORT) || 3306,
  database: process.env.MYSQL_ADDON_DB || 'bd_farmacia',
  user: process.env.MYSQL_ADDON_USER || 'root',
  password: process.env.MYSQL_ADDON_PASSWORD || '',
};

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  port: config.port,
  dialect: 'mysql',
  logging: false,
  // El plan gratuito (DEV) de Clever Cloud solo permite 5 conexiones simultáneas.
  pool: { max: 2, min: 0, acquire: 30000, idle: 10000 },
});

// Crea la base de datos si no existe (útil en local con XAMPP/MySQL).
// En Clever Cloud la base ya viene creada, por eso el error se ignora.
async function ensureDatabase() {
  try {
    const conn = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
    });
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\``);
    await conn.end();
  } catch (err) {
    // Sin permisos para crear bases de datos: se usa la existente.
  }
}

module.exports = { sequelize, ensureDatabase };
