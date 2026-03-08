const express = require('express');
const cors = require('cors');
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

const trustedDomains = (process.env.TRUSTDOMINIO || '')
  .split(',')
  .map((item) => item.trim().toLowerCase())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (trustedDomains.length === 0) return true;

  let parsed;
  try {
    parsed = new URL(origin);
  } catch (error) {
    return false;
  }

  const originHost = parsed.host.toLowerCase();
  const originHostname = parsed.hostname.toLowerCase();
  const normalizedOrigin = parsed.origin.toLowerCase();

  return trustedDomains.some((allowed) => {
    const normalizedAllowed = allowed.replace(/^https?:\/\//, '');
    return (
      normalizedAllowed === originHost ||
      normalizedAllowed === originHostname ||
      allowed === normalizedOrigin
    );
  });
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error('Origin not allowed by CORS'));
    },
  })
);
app.use(express.json());
const swaggerUiHandler = swaggerUi.setup(null, { swaggerUrl: '/swagger.json' });
app.use('/api-docs', swaggerUi.serve, swaggerUiHandler);
app.get('/swagger.json', (req, res) => res.json(buildSwaggerDoc(req)));
app.use(routes);

module.exports = app;
