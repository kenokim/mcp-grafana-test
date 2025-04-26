import axios, { AxiosInstance } from 'axios';
import {
  Dashboard,
  DashboardDetail,
  PanelDataRequest,
  PanelDataResponse,
  SnapshotRequest,
  SnapshotResponse,
  Snapshot,
  SnapshotDetail,
  TimeRange
} from '../types/grafana';

/**
 * Grafana API 요청을 처리하는 서비스 클래스
 */
export class GrafanaService {
  private readonly client: AxiosInstance;

  /**
   * GrafanaService 생성자
   * @param baseUrl Grafana API 서버 URL
   * @param apiKey Grafana API 키
   */
  constructor(baseUrl: string, apiKey: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * 대시보드 목록 조회
   * @param query 검색어 (선택적)
   * @param tag 특정 태그로 필터링 (선택적)
   * @param limit 반환할 최대 항목 수 (선택적)
   * @returns 대시보드 목록
   */
  async getDashboards(query?: string, tag?: string, limit?: number): Promise<Dashboard[]> {
    try {
      const params: Record<string, string | number> = { type: 'dash-db' };
      
      if (query) params.query = query;
      if (tag) params.tag = tag;
      if (limit) params.limit = limit;
      
      const response = await this.client.get('/api/search', { params });
      return response.data;
    } catch (error) {
      console.error('대시보드 목록 조회 실패:', error);
      throw new Error(`대시보드 목록 조회 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 대시보드 상세 정보 조회
   * @param uid 대시보드 고유 식별자
   * @returns 대시보드 상세 정보
   */
  async getDashboardByUid(uid: string): Promise<DashboardDetail> {
    try {
      const response = await this.client.get(`/api/dashboards/uid/${uid}`);
      return response.data;
    } catch (error) {
      console.error('대시보드 상세 정보 조회 실패:', error);
      throw new Error(`대시보드 상세 정보 조회 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 대시보드 패널 데이터 조회
   * @param request 패널 데이터 요청 객체
   * @returns 패널 데이터 응답
   */
  async getPanelData(request: PanelDataRequest): Promise<PanelDataResponse> {
    try {
      const response = await this.client.post('/api/ds/query', request);
      return response.data;
    } catch (error) {
      console.error('패널 데이터 조회 실패:', error);
      throw new Error(`패널 데이터 조회 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 스냅샷 생성
   * @param request 스냅샷 요청 객체
   * @returns 스냅샷 응답
   */
  async createSnapshot(request: SnapshotRequest): Promise<SnapshotResponse> {
    try {
      const response = await this.client.post('/api/snapshots', request);
      return response.data;
    } catch (error) {
      console.error('스냅샷 생성 실패:', error);
      throw new Error(`스냅샷 생성 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 스냅샷 목록 조회
   * @returns 스냅샷 목록
   */
  async getSnapshots(): Promise<Snapshot[]> {
    try {
      const response = await this.client.get('/api/snapshots');
      return response.data;
    } catch (error) {
      console.error('스냅샷 목록 조회 실패:', error);
      throw new Error(`스냅샷 목록 조회 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 특정 스냅샷 조회
   * @param key 스냅샷 키
   * @returns 스냅샷 상세 정보
   */
  async getSnapshotByKey(key: string): Promise<SnapshotDetail> {
    try {
      const response = await this.client.get(`/api/snapshots/${key}`);
      return response.data;
    } catch (error) {
      console.error('스냅샷 조회 실패:', error);
      throw new Error(`스냅샷 조회 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 스냅샷 삭제
   * @param deleteKey 스냅샷 삭제 키
   * @returns 삭제 결과
   */
  async deleteSnapshot(deleteKey: string): Promise<{ message: string }> {
    try {
      const response = await this.client.get(`/api/snapshots-delete/${deleteKey}`);
      return { message: 'Snapshot deleted successfully' };
    } catch (error) {
      console.error('스냅샷 삭제 실패:', error);
      throw new Error(`스냅샷 삭제 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * 전체 워크플로우: 대시보드를 조회하고 스냅샷을 생성
   * @param dashboardUid 대시보드 UID
   * @param snapshotName 생성할 스냅샷 이름
   * @param expires 만료 시간(초)
   * @returns 생성된 스냅샷 정보
   */
  async createDashboardSnapshot(
    dashboardUid: string, 
    snapshotName: string, 
    expires: number = 0
  ): Promise<SnapshotResponse> {
    try {
      // 1. 대시보드 상세 정보 조회
      const dashboardDetail = await this.getDashboardByUid(dashboardUid);
      const dashboard = dashboardDetail.dashboard;
      
      // 2. 패널 데이터 수집
      const panelsWithData = await Promise.all(
        dashboard.panels.map(async (panel) => {
          if (!panel.targets || panel.targets.length === 0) {
            return panel; // 데이터 소스가 없는 패널은 그대로 반환
          }
          
          // 패널의 쿼리 데이터 구성
          const queries = panel.targets.map(target => ({
            refId: target.refId,
            datasource: panel.datasource || { uid: 'default', type: 'prometheus' },
            expr: target.expr,
            instant: false,
            range: true
          }));
          
          // 패널 데이터 요청
          const request: PanelDataRequest = {
            queries,
            range: dashboard.time
          };
          
          const data = await this.getPanelData(request);
          
          // 패널에 스냅샷 데이터 추가
          return {
            ...panel,
            snapshotData: data
          };
        })
      );
      
      // 3. 스냅샷용 대시보드 모델 생성
      const snapshotDashboard = {
        ...dashboard,
        panels: panelsWithData,
        title: `${dashboard.title} (Snapshot)`
      };
      
      // 4. 스냅샷 생성 요청
      const request: SnapshotRequest = {
        dashboard: snapshotDashboard,
        name: snapshotName,
        expires
      };
      
      return await this.createSnapshot(request);
    } catch (error) {
      console.error('대시보드 스냅샷 생성 실패:', error);
      throw new Error(`대시보드 스냅샷 생성 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
} 