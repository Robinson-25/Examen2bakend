const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Varios orígenes separados por coma: CORS_ORIGIN=http://localhost:5173,https://mi-app.vercel.app
const origins = (process.env.CORS_ORIGIN || '').split(',').map((o) => o.trim().replace(/\/$/, '')).filter(Boolean);
app.use(cors({ origin: origins.length ? origins : true }));
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'API bd_farmacia funcionando' }));
app.use('/api', routes);

app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));
app.use(errorHandler);

module.exports = app;
