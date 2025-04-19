import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  GrafanaSearchResponse,
  GrafanaDashboard,
  GrafanaDataSource,
  GrafanaUser,
  GrafanaHealthResponse,
  GrafanaFolder,
  GrafanaDashboardMetaResponse,
  GrafanaAlertRule,
  GrafanaTeam,
} from '../types/grafana';

/**
 * Grafana API 클라이언트 서비스
 */
export class GrafanaApiService {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor() {
    // 하드코딩된 Grafana URL
    this.baseUrl = 'http://localhost:3000';

    // API 클라이언트 설정
    const config: AxiosRequestConfig = {
      baseURL: `${this.baseUrl}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
      // 하드코딩된 인증 정보
      auth: {
        username: 'admin',
        password: 'admin',
      }
    };

    this.client = axios.create(config);
  }

  /**
   * Grafana 헬스 체크
   */
  async checkHealth(): Promise<GrafanaHealthResponse> {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      this.handleError('헬스 체크에 실패했습니다', error);
      throw error;
    }
  }

  /**
   * 모든 대시보드 검색
   */
  async searchDashboards(query?: string, tag?: string): Promise<GrafanaSearchResponse> {
    try {
      const params: any = { type: 'dash-db' };
      if (query) params.query = query;
      if (tag) params.tag = tag;

      const response = await this.client.get('/search', { params });
      return response.data;
    } catch (error) {
      this.handleError('대시보드 검색에 실패했습니다', error);
      throw error;
    }
  }

  /**
   * 대시보드 UID로 대시보드 상세 정보 조회
   */
  async getDashboardByUid(uid: string): Promise<GrafanaDashboardMetaResponse> {
    try {
      const response = await this.client.get(`/dashboards/uid/${uid}`);
      return response.data;
    } catch (error) {
      this.handleError(`대시보드 [${uid}] 조회에 실패했습니다`, error);
      throw error;
    }
  }

  /**
   * 모든 폴더 조회
   */
  async getFolders(): Promise<GrafanaFolder[]> {
    try {
      const response = await this.client.get('/folders');
      return response.data;
    } catch (error) {
      this.handleError('폴더 조회에 실패했습니다', error);
      throw error;
    }
  }

  /**
   * 데이터 소스 목록 조회
   */
  async getDataSources(): Promise<GrafanaDataSource[]> {
    try {
      const response = await this.client.get('/datasources');
      return response.data;
    } catch (error) {
      this.handleError('데이터 소스 조회에 실패했습니다', error);
      throw error;
    }
  }

  /**
   * 특정 데이터 소스 조회
   */
  async getDataSourceById(id: number): Promise<GrafanaDataSource> {
    try {
      const response = await this.client.get(`/datasources/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(`데이터 소스 [${id}] 조회에 실패했습니다`, error);
      throw error;
    }
  }

  /**
   * 현재 사용자 정보 조회
   */
  async getCurrentUser(): Promise<GrafanaUser> {
    try {
      const response = await this.client.get('/user');
      return response.data;
    } catch (error) {
      this.handleError('현재 사용자 조회에 실패했습니다', error);
      throw error;
    }
  }

  /**
   * 모든 사용자 조회 (관리자 권한 필요)
   */
  async getUsers(): Promise<GrafanaUser[]> {
    try {
      const response = await this.client.get('/users');
      return response.data;
    } catch (error) {
      this.handleError('사용자 목록 조회에 실패했습니다', error);
      throw error;
    }
  }

  /**
   * 알림 규칙 조회
   */
  async getAlertRules(): Promise<GrafanaAlertRule[]> {
    try {
      const response = await this.client.get('/alerts');
      return response.data;
    } catch (error) {
      this.handleError('알림 규칙 조회에 실패했습니다', error);
      throw error;
    }
  }

  /**
   * 팀 목록 조회
   */
  async getTeams(): Promise<GrafanaTeam[]> {
    try {
      const response = await this.client.get('/teams');
      return response.data;
    } catch (error) {
      this.handleError('팀 목록 조회에 실패했습니다', error);
      throw error;
    }
  }

  /**
   * 스냅샷 목록 조회
   */
  async getSnapshots(): Promise<any[]> {
    try {
      const response = await this.client.get('/dashboard/snapshots');
      return response.data;
    } catch (error) {
      this.handleError('스냅샷 목록 조회에 실패했습니다', error);
      throw error;
    }
  }

  /**
   * 조직 목록 조회 (관리자 권한 필요)
   */
  async getOrganizations(): Promise<any[]> {
    try {
      const response = await this.client.get('/orgs');
      return response.data;
    } catch (error) {
      this.handleError('조직 목록 조회에 실패했습니다', error);
      throw error;
    }
  }

  /**
   * 에러 처리 메서드
   */
  private handleError(message: string, error: any): void {
    console.error(`🔴 ${message}:`);
    if (axios.isAxiosError(error)) {
      console.error(`   상태 코드: ${error.response?.status}`);
      console.error(`   메시지: ${error.response?.data?.message || error.message}`);
      if (error.response?.data) {
        console.error(`   상세 정보:`, error.response.data);
      }
    } else {
      console.error(`   에러:`, error);
    }
  }
} 