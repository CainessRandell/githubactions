import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fivam',
      version: '0.0.0',
      description: 'Documentação da API',
    },
  },
  apis: [
    './routes/auth.routes.js',
    './routes/posts.routes.js',
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerUi, swaggerDocs };
