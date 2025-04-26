import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Grafana API',
      version: '1.0.0',
      description: 'Grafana 대시보드 조회 및 스냅샷 생성 API',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server'
      }
    ]
  },
  apis: ['./src/controllers/*.ts'], // Swagger JSDoc의 주석을 가져올 파일 패턴
};

export const swaggerSpec = swaggerJSDoc(options); 