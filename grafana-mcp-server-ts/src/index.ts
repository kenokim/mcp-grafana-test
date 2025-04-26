import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import { Router } from 'express';
import { swaggerSpec } from './config/swagger';
import { setupGrafanaRoutes } from './routes/grafana-routes';

// 환경 변수 로드
dotenv.config();

// 필수 환경 변수 확인
const GRAFANA_URL = process.env.GRAFANA_URL || 'http://localhost:3000';
const GRAFANA_API_KEY = process.env.GRAFANA_API_KEY || '';

if (!GRAFANA_API_KEY) {
  console.error('GRAFANA_API_KEY 환경 변수가 설정되지 않았습니다.');
  console.error('Grafana API 키를 .env 파일에 설정하세요.');
  process.exit(1);
}

// Express 앱 초기화
const app = express();
const PORT = process.env.PORT || 4000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 라우터 설정
const apiRouter = Router();
app.use('/api', setupGrafanaRoutes(apiRouter, GRAFANA_URL, GRAFANA_API_KEY));

// Swagger UI 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 기본 엔드포인트
app.get('/', (req, res) => {
  res.json({
    message: 'Grafana API Server',
    docs: '/api-docs'
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log(`API 문서: http://localhost:${PORT}/api-docs`);
});

// 프로세스 종료 처리
process.on('SIGINT', () => {
  console.log('서버를 종료합니다.');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('처리되지 않은 예외:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('처리되지 않은 프라미스 거부:', promise, '이유:', reason);
}); 