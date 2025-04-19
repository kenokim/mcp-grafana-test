import { Router, Request, Response } from 'express';
import { GrafanaController } from '../controllers/grafana-controller';

export function setupGrafanaRoutes(router: Router, grafanaUrl: string, apiKey: string): Router {
  const grafanaController = new GrafanaController(grafanaUrl, apiKey);
  
  // 대시보드 관련 엔드포인트
  router.get('/dashboards', (req: Request, res: Response) => grafanaController.getDashboards(req, res));
  router.get('/dashboards/:uid', (req: Request, res: Response) => grafanaController.getDashboardByUid(req, res));
  
  // 패널 데이터 관련 엔드포인트
  router.post('/ds/query', (req: Request, res: Response) => grafanaController.getPanelData(req, res));
  
  // 스냅샷 관련 엔드포인트
  router.post('/snapshots', (req: Request, res: Response) => grafanaController.createSnapshot(req, res));
  router.get('/snapshots', (req: Request, res: Response) => grafanaController.getSnapshots(req, res));
  router.get('/snapshots/:key', (req: Request, res: Response) => grafanaController.getSnapshotByKey(req, res));
  router.get('/snapshots-delete/:deleteKey', (req: Request, res: Response) => grafanaController.deleteSnapshot(req, res));
  
  // 전체 워크플로우 엔드포인트
  router.post('/dashboard-snapshot', (req: Request, res: Response) => grafanaController.createDashboardSnapshot(req, res));
  
  return router;
} 