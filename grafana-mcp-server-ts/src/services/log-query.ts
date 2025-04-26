import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * Grafana Loki 로그 쿼리 인터페이스
 */
export interface LogQueryOptions {
  query: string;
  limit?: number;
  start?: number | string;
  end?: number | string;
  step?: string;
  direction?: 'forward' | 'backward';
}

/**
 * Grafana Loki 로그 응답 인터페이스
 */
export interface LogQueryResponse {
  status: string;
  data: {
    resultType: string;
    result: Array<{
      stream: Record<string, string>;
      values: Array<[string, string]>; // [timestamp, log message]
    }>;
  };
}

/**
 * 형식화된 로그 메시지 인터페이스
 */
export interface FormattedLogMessage {
  timestamp: string;
  time: Date;
  message: string;
  level?: string;
  source?: string;
  labels?: Record<string, string>;
}

/**
 * Grafana Loki를 통해 Spring Boot 로그를 조회하는 서비스
 */
export class LogQueryService {
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
   * Loki API를 통해 로그를 쿼리합니다
   * @param options 로그 쿼리 옵션
   */
  async queryLogs(options: LogQueryOptions): Promise<LogQueryResponse> {
    try {
      // Loki Query API 엔드포인트
      const endpoint = `${this.grafanaUrl}/loki/api/v1/query_range`;
      
      // 쿼리 파라미터 구성
      const params: Record<string, string> = {
        query: options.query,
        limit: options.limit?.toString() || '100',
        direction: options.direction || 'backward',
      };

      // 시작 시간과 종료 시간 추가
      if (options.start) {
        params.start = typeof options.start === 'number' 
          ? options.start.toString() 
          : options.start;
      }
      
      if (options.end) {
        params.end = typeof options.end === 'number' 
          ? options.end.toString() 
          : options.end;
      }
      
      if (options.step) {
        params.step = options.step;
      }

      const response = await this.client.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error('로그 쿼리에 실패했습니다:', error);
      throw error;
    }
  }

  /**
   * Spring Boot 애플리케이션 로그를 조회합니다
   * @param level 로그 레벨 (예: 'info', 'error', 'warn', 'debug')
   * @param timeRange 조회할 시간 범위 (예: '5m', '1h', '1d')
   * @param limit 최대 로그 수
   */
  async getSpringBootLogs(
    level?: string, 
    timeRange: string = '1h', 
    limit: number = 100
  ): Promise<FormattedLogMessage[]> {
    try {
      // 현재 시간 (Unix 타임스탬프, 초 단위)
      const now = Math.floor(Date.now() / 1000);
      
      // 시간 범위에 따른 시작 시간 계산
      let start = now;
      const timeValue = parseInt(timeRange.slice(0, -1));
      const timeUnit = timeRange.slice(-1);
      
      switch (timeUnit) {
        case 'm': // 분
          start = now - (timeValue * 60);
          break;
        case 'h': // 시간
          start = now - (timeValue * 60 * 60);
          break;
        case 'd': // 일
          start = now - (timeValue * 24 * 60 * 60);
          break;
        default:
          start = now - (60 * 60); // 기본값: 1시간
      }

      // 로그 레벨에 따른 쿼리 조건 구성
      let query = '{app="target-api"}';
      if (level) {
        query = `{app="target-api"} |= "${level.toUpperCase()}"`;
      }

      // 로그 쿼리 옵션
      const options: LogQueryOptions = {
        query,
        start,
        end: now,
        limit,
        direction: 'backward', // 최신 로그부터 표시
      };

      // 로그 쿼리 실행
      const response = await this.queryLogs(options);
      
      // 응답 결과 가공
      return this.formatLogResponse(response);
    } catch (error) {
      console.error('Spring Boot 로그 조회에 실패했습니다:', error);
      throw error;
    }
  }

  /**
   * 로그 응답을 형식화합니다
   * @param response Loki API 응답
   */
  private formatLogResponse(response: LogQueryResponse): FormattedLogMessage[] {
    const formattedLogs: FormattedLogMessage[] = [];

    if (response.status === 'success' && response.data.result) {
      for (const result of response.data.result) {
        const labels = result.stream;
        
        for (const [timestamp, message] of result.values) {
          // 타임스탬프를 Date 객체로 변환
          const time = new Date(parseFloat(timestamp) * 1000);
          
          // 로그 레벨 추출 (예: [INFO], [ERROR] 등)
          let level: string | undefined;
          const levelMatch = message.match(/\[(INFO|ERROR|WARN|DEBUG)\]/i);
          if (levelMatch) {
            level = levelMatch[1].toUpperCase();
          }
          
          // 로그 소스 추출 (예: TargetApiApplication, SlowApiController 등)
          let source: string | undefined;
          const sourceMatch = message.match(/\[([^\]]+)\]/g);
          if (sourceMatch && sourceMatch.length > 1) {
            source = sourceMatch[1].replace(/[\[\]]/g, '');
          }
          
          formattedLogs.push({
            timestamp: timestamp,
            time,
            message,
            level,
            source,
            labels
          });
        }
      }
    }

    return formattedLogs;
  }

  /**
   * 특정 시간 범위의 에러 로그 수를 집계합니다
   * @param timeRange 조회할 시간 범위 (예: '5m', '1h', '1d')
   */
  async getErrorCount(timeRange: string = '1h'): Promise<number> {
    try {
      const logs = await this.getSpringBootLogs('error', timeRange, 1000);
      return logs.length;
    } catch (error) {
      console.error('에러 로그 집계에 실패했습니다:', error);
      return 0;
    }
  }

  /**
   * 최근 슬로우 API 호출 목록을 가져옵니다
   * @param timeRange 조회할 시간 범위 (예: '5m', '1h', '1d')
   * @param limit 최대 로그 수
   */
  async getSlowApiLogs(timeRange: string = '1h', limit: number = 20): Promise<FormattedLogMessage[]> {
    try {
      // 현재 시간 (Unix 타임스탬프, 초 단위)
      const now = Math.floor(Date.now() / 1000);
      
      // 시간 범위에 따른 시작 시간 계산
      let start = now;
      const timeValue = parseInt(timeRange.slice(0, -1));
      const timeUnit = timeRange.slice(-1);
      
      switch (timeUnit) {
        case 'm': // 분
          start = now - (timeValue * 60);
          break;
        case 'h': // 시간
          start = now - (timeValue * 60 * 60);
          break;
        case 'd': // 일
          start = now - (timeValue * 24 * 60 * 60);
          break;
        default:
          start = now - (60 * 60); // 기본값: 1시간
      }

      // 슬로우 API 관련 로그 검색 쿼리
      const query = '{app="target-api"} |= "Slow API"';

      // 로그 쿼리 옵션
      const options: LogQueryOptions = {
        query,
        start,
        end: now,
        limit,
        direction: 'backward', // 최신 로그부터 표시
      };

      // 로그 쿼리 실행
      const response = await this.queryLogs(options);
      
      // 응답 결과 가공
      return this.formatLogResponse(response);
    } catch (error) {
      console.error('슬로우 API 로그 조회에 실패했습니다:', error);
      return [];
    }
  }
} 