import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * 대시보드 패널 타입
 */
export interface DashboardPanel {
  id: number;
  title: string;
  type: string;
  description?: string;
  targets?: Array<{
    refId: string;
    expr?: string;
    legendFormat?: string;
  }>;
}

/**
 * 대시보드 정보 타입
 */
export interface DashboardInfo {
  uid: string;
  title: string;
  url: string;
  panels: DashboardPanel[];
  tags: string[];
  version: number;
  schemaVersion: number;
  folderTitle?: string;
  folderUid?: string;
}

/**
 * 메트릭 쿼리 응답 타입
 */
export interface MetricQueryResponse {
  status: string;
  data: {
    resultType: string;
    result: Array<{
      metric: Record<string, string>;
      values?: Array<[number, string]>; // [timestamp, value]
      value?: [number, string]; // [timestamp, value] - 단일 값인 경우
    }>;
  };
}

/**
 * 시계열 데이터 포인트 타입
 */
export interface TimeSeriesPoint {
  time: Date;
  value: number;
  metric?: Record<string, string>;
}

/**
 * 대시보드 및 메트릭 조회 서비스
 */
export class DashboardQueryService {
  private client: AxiosInstance;
  private grafanaUrl: string;

  constructor(grafanaUrl: string = 'http://localhost:3000') {
    this.grafanaUrl = grafanaUrl;
    
    // API 클라이언트 설정
    const config: AxiosRequestConfig = {
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
   * 대시보드 목록을 조회합니다
   */
  async getDashboards(tag?: string): Promise<any[]> {
    try {
      const params: Record<string, string> = { type: 'dash-db' };
      if (tag) {
        params.tag = tag;
      }

      const response = await this.client.get(`${this.grafanaUrl}/api/search`, { params });
      return response.data;
    } catch (error) {
      console.error('대시보드 목록 조회에 실패했습니다:', error);
      throw error;
    }
  }

  /**
   * 대시보드 상세 정보를 조회합니다
   * @param uid 대시보드 UID
   */
  async getDashboardByUid(uid: string): Promise<DashboardInfo> {
    try {
      const response = await this.client.get(`${this.grafanaUrl}/api/dashboards/uid/${uid}`);
      const dashboardData = response.data;
      
      const dashboard = dashboardData.dashboard;
      const meta = dashboardData.meta;
      
      // 패널 정보 추출
      const panels = dashboard.panels.map((panel: any) => ({
        id: panel.id,
        title: panel.title,
        type: panel.type,
        description: panel.description,
        targets: panel.targets?.map((target: any) => ({
          refId: target.refId,
          expr: target.expr,
          legendFormat: target.legendFormat
        }))
      }));
      
      return {
        uid: dashboard.uid,
        title: dashboard.title,
        url: meta.url,
        panels,
        tags: dashboard.tags || [],
        version: dashboard.version,
        schemaVersion: dashboard.schemaVersion,
        folderTitle: meta.folderTitle,
        folderUid: meta.folderUid
      };
    } catch (error) {
      console.error(`대시보드 [${uid}] 조회에 실패했습니다:`, error);
      throw error;
    }
  }

  /**
   * 특정 대시보드의 Spring Boot 관련 패널 목록을 조회합니다
   * @param uid 대시보드 UID
   */
  async getSpringBootPanels(uid: string): Promise<DashboardPanel[]> {
    try {
      const dashboardInfo = await this.getDashboardByUid(uid);
      
      // Spring Boot 관련 쿼리를 포함하는 패널 필터링
      return dashboardInfo.panels.filter(panel => {
        if (!panel.targets) return false;
        
        return panel.targets.some(target => {
          const expr = target.expr || '';
          return expr.includes('jvm_') || 
                 expr.includes('process_') || 
                 expr.includes('http_server_requests') ||
                 expr.includes('system_cpu') ||
                 expr.includes('tomcat_') ||
                 expr.includes('hikaricp_');
        });
      });
    } catch (error) {
      console.error(`Spring Boot 패널 조회에 실패했습니다:`, error);
      throw error;
    }
  }

  /**
   * Prometheus API를 통해 메트릭을 쿼리합니다
   * @param query Prometheus 쿼리 표현식
   * @param start 시작 시간 (Unix 타임스탬프, 초 단위)
   * @param end 종료 시간 (Unix 타임스탬프, 초 단위)
   * @param step 단계 (초 단위, 예: '15s', '1m', '5m')
   */
  async queryMetric(
    query: string,
    start?: number,
    end?: number,
    step: string = '15s'
  ): Promise<MetricQueryResponse> {
    try {
      // 시작 및 종료 시간 기본값 설정 (기본: 최근 1시간)
      const now = Math.floor(Date.now() / 1000);
      const startTime = start || now - 3600;
      const endTime = end || now;
      
      // Prometheus Query API 엔드포인트
      const endpoint = `${this.grafanaUrl}/api/datasources/proxy/1/api/v1/query_range`;
      
      const params = {
        query,
        start: startTime.toString(),
        end: endTime.toString(),
        step
      };

      const response = await this.client.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error('메트릭 쿼리에 실패했습니다:', error);
      throw error;
    }
  }

  /**
   * 메트릭 응답을 시계열 데이터 포인트로 변환합니다
   * @param response Prometheus API 응답
   */
  parseTimeSeriesData(response: MetricQueryResponse): TimeSeriesPoint[] {
    const timeSeriesData: TimeSeriesPoint[] = [];

    if (response.status === 'success' && response.data.result) {
      for (const result of response.data.result) {
        const metric = result.metric;
        
        // 단일 값인 경우
        if (result.value) {
          const [timestamp, value] = result.value;
          timeSeriesData.push({
            time: new Date(timestamp * 1000),
            value: parseFloat(value),
            metric
          });
        }
        
        // 시계열 값인 경우
        else if (result.values) {
          for (const [timestamp, value] of result.values) {
            timeSeriesData.push({
              time: new Date(timestamp * 1000),
              value: parseFloat(value),
              metric
            });
          }
        }
      }
    }

    return timeSeriesData;
  }

  /**
   * Spring Boot 애플리케이션의 JVM 메모리 사용량을 조회합니다
   * @param timeRange 조회할 시간 범위 (초 단위)
   */
  async getJvmMemoryUsage(timeRange: number = 3600): Promise<TimeSeriesPoint[]> {
    try {
      const now = Math.floor(Date.now() / 1000);
      const start = now - timeRange;
      
      const query = 'jvm_memory_used_bytes{area="heap"}';
      const response = await this.queryMetric(query, start, now, '15s');
      
      return this.parseTimeSeriesData(response);
    } catch (error) {
      console.error('JVM 메모리 사용량 조회에 실패했습니다:', error);
      return [];
    }
  }

  /**
   * Spring Boot 애플리케이션의 Slow API 응답 시간을 조회합니다
   * @param timeRange 조회할 시간 범위 (초 단위)
   */
  async getSlowApiResponseTime(timeRange: number = 3600): Promise<TimeSeriesPoint[]> {
    try {
      const now = Math.floor(Date.now() / 1000);
      const start = now - timeRange;
      
      const query = 'histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket{uri="/api/slow"}[5m])) by (le))';
      const response = await this.queryMetric(query, start, now, '15s');
      
      return this.parseTimeSeriesData(response);
    } catch (error) {
      console.error('Slow API 응답 시간 조회에 실패했습니다:', error);
      return [];
    }
  }

  /**
   * Spring Boot 애플리케이션의 CPU 사용률을 조회합니다
   * @param timeRange 조회할 시간 범위 (초 단위)
   */
  async getCpuUsage(timeRange: number = 3600): Promise<TimeSeriesPoint[]> {
    try {
      const now = Math.floor(Date.now() / 1000);
      const start = now - timeRange;
      
      const query = 'process_cpu_usage*100';
      const response = await this.queryMetric(query, start, now, '15s');
      
      return this.parseTimeSeriesData(response);
    } catch (error) {
      console.error('CPU 사용률 조회에 실패했습니다:', error);
      return [];
    }
  }

  /**
   * HTTP 요청 에러율을 조회합니다
   * @param timeRange 조회할 시간 범위 (초 단위)
   */
  async getHttpErrorRate(timeRange: number = 3600): Promise<TimeSeriesPoint[]> {
    try {
      const now = Math.floor(Date.now() / 1000);
      const start = now - timeRange;
      
      const query = 'sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m])) / sum(rate(http_server_requests_seconds_count[5m])) * 100';
      const response = await this.queryMetric(query, start, now, '15s');
      
      return this.parseTimeSeriesData(response);
    } catch (error) {
      console.error('HTTP 에러율 조회에 실패했습니다:', error);
      return [];
    }
  }

  /**
   * Spring Boot 애플리케이션의 상태 요약을 가져옵니다
   */
  async getApplicationStatus(): Promise<Record<string, any>> {
    try {
      // 최근 1시간 메트릭 데이터 조회
      const [
        memoryData, 
        cpuData, 
        apiResponseData, 
        errorRateData
      ] = await Promise.all([
        this.getJvmMemoryUsage(),
        this.getCpuUsage(),
        this.getSlowApiResponseTime(),
        this.getHttpErrorRate()
      ]);
      
      // 마지막 데이터 포인트 가져오기
      const lastMemory = memoryData.length > 0 ? memoryData[memoryData.length - 1].value : 0;
      const lastCpu = cpuData.length > 0 ? cpuData[cpuData.length - 1].value : 0;
      const lastApiResponse = apiResponseData.length > 0 ? apiResponseData[apiResponseData.length - 1].value : 0;
      const lastErrorRate = errorRateData.length > 0 ? errorRateData[errorRateData.length - 1].value : 0;
      
      // 메모리 크기를 MB 단위로 변환
      const memoryMB = (lastMemory / (1024 * 1024)).toFixed(2);
      
      return {
        jvmMemory: {
          value: parseFloat(memoryMB),
          unit: 'MB',
          formatted: `${memoryMB} MB`
        },
        cpuUsage: {
          value: parseFloat(lastCpu.toFixed(2)),
          unit: '%',
          formatted: `${lastCpu.toFixed(2)}%`
        },
        slowApiResponseTime: {
          value: parseFloat(lastApiResponse.toFixed(3)),
          unit: 's',
          formatted: `${lastApiResponse.toFixed(3)} s`
        },
        httpErrorRate: {
          value: parseFloat(lastErrorRate.toFixed(2)),
          unit: '%',
          formatted: `${lastErrorRate.toFixed(2)}%`
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('애플리케이션 상태 조회에 실패했습니다:', error);
      return {
        error: '애플리케이션 상태 조회에 실패했습니다',
        timestamp: new Date().toISOString()
      };
    }
  }
} 