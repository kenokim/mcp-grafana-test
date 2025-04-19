import { Request, Response } from 'express';
import { GrafanaService } from '../services/grafana-service';
import { PanelDataRequest, SnapshotRequest } from '../types/grafana';

/**
 * Grafana API 관련 엔드포인트를 처리하는 컨트롤러
 */
export class GrafanaController {
  private grafanaService: GrafanaService;

  /**
   * GrafanaController 생성자
   * @param grafanaUrl Grafana API 서버 URL
   * @param apiKey Grafana API 키
   */
  constructor(grafanaUrl: string, apiKey: string) {
    this.grafanaService = new GrafanaService(grafanaUrl, apiKey);
  }

  /**
   * @swagger
   * /api/dashboards:
   *   get:
   *     summary: 대시보드 목록 조회
   *     description: Grafana의 대시보드 목록을 조회합니다.
   *     tags:
   *       - Dashboards
   *     parameters:
   *       - in: query
   *         name: query
   *         schema:
   *           type: string
   *         description: 검색어
   *       - in: query
   *         name: tag
   *         schema:
   *           type: string
   *         description: 특정 태그로 필터링
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: 반환할 최대 항목 수
   *     responses:
   *       200:
   *         description: 성공적으로 대시보드 목록 조회
   *       500:
   *         description: 서버 오류
   */
  async getDashboards(req: Request, res: Response): Promise<void> {
    try {
      const { query, tag, limit } = req.query;
      const dashboards = await this.grafanaService.getDashboards(
        query as string,
        tag as string,
        limit ? parseInt(limit as string) : undefined
      );
      res.status(200).json(dashboards);
    } catch (error) {
      console.error('대시보드 목록 조회 실패:', error);
      res.status(500).json({
        error: '대시보드 목록 조회 실패',
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @swagger
   * /api/dashboards/{uid}:
   *   get:
   *     summary: 대시보드 상세 정보 조회
   *     description: 특정 대시보드의 상세 정보를 조회합니다.
   *     tags:
   *       - Dashboards
   *     parameters:
   *       - in: path
   *         name: uid
   *         required: true
   *         schema:
   *           type: string
   *         description: 대시보드 고유 식별자
   *     responses:
   *       200:
   *         description: 성공적으로 대시보드 상세 정보 조회
   *       404:
   *         description: 대시보드를 찾을 수 없음
   *       500:
   *         description: 서버 오류
   */
  async getDashboardByUid(req: Request, res: Response): Promise<void> {
    try {
      const { uid } = req.params;
      const dashboard = await this.grafanaService.getDashboardByUid(uid);
      res.status(200).json(dashboard);
    } catch (error) {
      console.error('대시보드 상세 정보 조회 실패:', error);
      res.status(500).json({
        error: '대시보드 상세 정보 조회 실패',
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @swagger
   * /api/ds/query:
   *   post:
   *     summary: 패널 데이터 조회
   *     description: 대시보드 패널의 데이터를 조회합니다.
   *     tags:
   *       - Panel Data
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               queries:
   *                 type: array
   *                 items:
   *                   type: object
   *               range:
   *                 type: object
   *     responses:
   *       200:
   *         description: 성공적으로 패널 데이터 조회
   *       500:
   *         description: 서버 오류
   */
  async getPanelData(req: Request, res: Response): Promise<void> {
    try {
      const request: PanelDataRequest = req.body;
      const data = await this.grafanaService.getPanelData(request);
      res.status(200).json(data);
    } catch (error) {
      console.error('패널 데이터 조회 실패:', error);
      res.status(500).json({
        error: '패널 데이터 조회 실패',
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @swagger
   * /api/snapshots:
   *   post:
   *     summary: 스냅샷 생성
   *     description: 대시보드의 스냅샷을 생성합니다.
   *     tags:
   *       - Snapshots
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               dashboard:
   *                 type: object
   *               name:
   *                 type: string
   *               expires:
   *                 type: integer
   *     responses:
   *       200:
   *         description: 성공적으로 스냅샷 생성
   *       500:
   *         description: 서버 오류
   */
  async createSnapshot(req: Request, res: Response): Promise<void> {
    try {
      const request: SnapshotRequest = req.body;
      const snapshot = await this.grafanaService.createSnapshot(request);
      res.status(200).json(snapshot);
    } catch (error) {
      console.error('스냅샷 생성 실패:', error);
      res.status(500).json({
        error: '스냅샷 생성 실패',
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @swagger
   * /api/snapshots:
   *   get:
   *     summary: 스냅샷 목록 조회
   *     description: 모든 스냅샷 목록을 조회합니다.
   *     tags:
   *       - Snapshots
   *     responses:
   *       200:
   *         description: 성공적으로 스냅샷 목록 조회
   *       500:
   *         description: 서버 오류
   */
  async getSnapshots(req: Request, res: Response): Promise<void> {
    try {
      const snapshots = await this.grafanaService.getSnapshots();
      res.status(200).json(snapshots);
    } catch (error) {
      console.error('스냅샷 목록 조회 실패:', error);
      res.status(500).json({
        error: '스냅샷 목록 조회 실패',
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @swagger
   * /api/snapshots/{key}:
   *   get:
   *     summary: 특정 스냅샷 조회
   *     description: 특정 스냅샷의 상세 정보를 조회합니다.
   *     tags:
   *       - Snapshots
   *     parameters:
   *       - in: path
   *         name: key
   *         required: true
   *         schema:
   *           type: string
   *         description: 스냅샷 키
   *     responses:
   *       200:
   *         description: 성공적으로 스냅샷 조회
   *       404:
   *         description: 스냅샷을 찾을 수 없음
   *       500:
   *         description: 서버 오류
   */
  async getSnapshotByKey(req: Request, res: Response): Promise<void> {
    try {
      const { key } = req.params;
      const snapshot = await this.grafanaService.getSnapshotByKey(key);
      res.status(200).json(snapshot);
    } catch (error) {
      console.error('스냅샷 조회 실패:', error);
      res.status(500).json({
        error: '스냅샷 조회 실패',
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @swagger
   * /api/snapshots-delete/{deleteKey}:
   *   get:
   *     summary: 스냅샷 삭제
   *     description: 지정된 삭제 키를 사용하여 스냅샷을 삭제합니다.
   *     tags:
   *       - Snapshots
   *     parameters:
   *       - in: path
   *         name: deleteKey
   *         required: true
   *         schema:
   *           type: string
   *         description: 스냅샷 삭제 키
   *     responses:
   *       200:
   *         description: 성공적으로 스냅샷 삭제
   *       404:
   *         description: 스냅샷을 찾을 수 없음
   *       500:
   *         description: 서버 오류
   */
  async deleteSnapshot(req: Request, res: Response): Promise<void> {
    try {
      const { deleteKey } = req.params;
      const result = await this.grafanaService.deleteSnapshot(deleteKey);
      res.status(200).json(result);
    } catch (error) {
      console.error('스냅샷 삭제 실패:', error);
      res.status(500).json({
        error: '스냅샷 삭제 실패',
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * @swagger
   * /api/dashboard-snapshot:
   *   post:
   *     summary: 대시보드 스냅샷 생성 (전체 워크플로우)
   *     description: 대시보드 조회부터 패널 데이터 수집, 스냅샷 생성까지의 전체 워크플로우를 실행합니다.
   *     tags:
   *       - Dashboard Snapshot
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - dashboardUid
   *               - snapshotName
   *             properties:
   *               dashboardUid:
   *                 type: string
   *                 description: 대시보드 고유 식별자
   *               snapshotName:
   *                 type: string
   *                 description: 생성할 스냅샷 이름
   *               expires:
   *                 type: integer
   *                 description: 스냅샷 만료 시간(초)
   *                 default: 0
   *     responses:
   *       200:
   *         description: 성공적으로 대시보드 스냅샷 생성
   *       404:
   *         description: 대시보드를 찾을 수 없음
   *       500:
   *         description: 서버 오류
   */
  async createDashboardSnapshot(req: Request, res: Response): Promise<void> {
    try {
      const { dashboardUid, snapshotName, expires } = req.body;
      
      if (!dashboardUid || !snapshotName) {
        res.status(400).json({
          error: '필수 매개변수 누락',
          message: 'dashboardUid와 snapshotName은 필수입니다.'
        });
        return;
      }
      
      const snapshot = await this.grafanaService.createDashboardSnapshot(
        dashboardUid,
        snapshotName,
        expires || 0
      );
      
      res.status(200).json(snapshot);
    } catch (error) {
      console.error('대시보드 스냅샷 생성 실패:', error);
      res.status(500).json({
        error: '대시보드 스냅샷 생성 실패',
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }
} 