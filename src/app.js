const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const app = express();

// Respeita proxies para detectar proto/host corretos
app.set('trust proxy', true);

const buildSwaggerDoc = (req) => {
  const doc = JSON.parse(JSON.stringify(swaggerDocument));
  const protoHeader = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const proto = protoHeader.split(',')[0].trim();
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  if (host) {
    doc.servers = [{ url: `${proto}://${host}` }];
  }
  return doc;
};

app.use(express.json());
const swaggerUiHandler = swaggerUi.setup(null, { swaggerUrl: '/swagger.json' });
app.use('/api-docs', swaggerUi.serve, swaggerUiHandler);
app.get('/swagger.json', (req, res) => res.json(buildSwaggerDoc(req)));
app.use(routes);

module.exports = app;
