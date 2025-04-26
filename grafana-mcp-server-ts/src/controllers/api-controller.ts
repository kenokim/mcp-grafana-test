import { LogQueryService, FormattedLogMessage } from '../services/log-query';
import { DashboardQueryService, DashboardInfo, DashboardPanel, TimeSeriesPoint } from '../services/dashboard-query';

/**
 * API 컨트롤러 클래스
 */
export class ApiController {
  private logQueryService: LogQueryService;
  private dashboardQueryService: DashboardQueryService;

  constructor() {
    this.logQueryService = new LogQueryService();
    this.dashboardQueryService = new DashboardQueryService();
  }

  /**
   * Spring Boot 로그 목록을 가져옵니다
   * @param level 로그 레벨 (선택 사항, 기본값은 모든 레벨)
   * @param timeRange 시간 범위 (선택 사항, 기본값은 1시간)
   * @param limit 최대 로그 수 (선택 사항, 기본값은 100)
   */
  async getSpringBootLogs(
    level?: string,
    timeRange: string = '1h',
    limit: number = 100
  ): Promise<FormattedLogMessage[]> {
    try {
      console.log(`Spring Boot 로그 조회: level=${level || 'all'}, timeRange=${timeRange}, limit=${limit}`);
      const logs = await this.logQueryService.getSpringBootLogs(level, timeRange, limit);
      return logs;
    } catch (error) {
      console.error('로그 조회 중 오류 발생:', error);
      throw new Error('로그 조회에 실패했습니다');
    }
  }

  /**
   * 에러 로그 수를 집계합니다
   * @param timeRange 시간 범위 (선택 사항, 기본값은 1시간)
   */
  async getErrorCount(timeRange: string = '1h'): Promise<{ count: number; timeRange: string }> {
    try {
      console.log(`에러 로그 수 집계: timeRange=${timeRange}`);
      const count = await this.logQueryService.getErrorCount(timeRange);
      return { count, timeRange };
    } catch (error) {
      console.error('에러 로그 집계 중 오류 발생:', error);
      throw new Error('에러 로그 집계에 실패했습니다');
    }
  }

  /**
   * 슬로우 API 로그를 가져옵니다
   * @param timeRange 시간 범위 (선택 사항, 기본값은 1시간)
   * @param limit 최대 로그 수 (선택 사항, 기본값은 20)
   */
  async getSlowApiLogs(
    timeRange: string = '1h',
    limit: number = 20
  ): Promise<FormattedLogMessage[]> {
    try {
      console.log(`슬로우 API 로그 조회: timeRange=${timeRange}, limit=${limit}`);
      const logs = await this.logQueryService.getSlowApiLogs(timeRange, limit);
      return logs;
    } catch (error) {
      console.error('슬로우 API 로그 조회 중 오류 발생:', error);
      throw new Error('슬로우 API 로그 조회에 실패했습니다');
    }
  }

  /**
   * 대시보드 목록을 조회합니다
   * @param tag 태그 (선택 사항)
   */
  async getDashboards(tag?: string): Promise<any[]> {
    try {
      console.log(`대시보드 목록 조회: tag=${tag || 'all'}`);
      const dashboards = await this.dashboardQueryService.getDashboards(tag);
      return dashboards;
    } catch (error) {
      console.error('대시보드 목록 조회 중 오류 발생:', error);
      throw new Error('대시보드 목록 조회에 실패했습니다');
    }
  }

  /**
   * 대시보드 상세 정보를 조회합니다
   * @param uid 대시보드 UID
   */
  async getDashboardByUid(uid: string): Promise<DashboardInfo> {
    try {
      console.log(`대시보드 상세 정보 조회: uid=${uid}`);
      const dashboard = await this.dashboardQueryService.getDashboardByUid(uid);
      return dashboard;
    } catch (error) {
      console.error(`대시보드 상세 정보 조회 중 오류 발생: uid=${uid}`, error);
      throw new Error('대시보드 상세 정보 조회에 실패했습니다');
    }
  }

  /**
   * Spring Boot 관련 패널 목록을 조회합니다
   * @param uid 대시보드 UID
   */
  async getSpringBootPanels(uid: string): Promise<DashboardPanel[]> {
    try {
      console.log(`Spring Boot 패널 목록 조회: uid=${uid}`);
      const panels = await this.dashboardQueryService.getSpringBootPanels(uid);
      return panels;
    } catch (error) {
      console.error(`Spring Boot 패널 목록 조회 중 오류 발생: uid=${uid}`, error);
      throw new Error('Spring Boot 패널 목록 조회에 실패했습니다');
    }
  }

  /**
   * JVM 메모리 사용량을 조회합니다
   * @param timeRange 시간 범위 (초 단위, 선택 사항, 기본값은 1시간)
   */
  async getJvmMemoryUsage(timeRange: number = 3600): Promise<TimeSeriesPoint[]> {
    try {
      console.log(`JVM 메모리 사용량 조회: timeRange=${timeRange}`);
      const data = await this.dashboardQueryService.getJvmMemoryUsage(timeRange);
      return data;
    } catch (error) {
      console.error('JVM 메모리 사용량 조회 중 오류 발생:', error);
      throw new Error('JVM 메모리 사용량 조회에 실패했습니다');
    }
  }

  /**
   * Slow API 응답 시간을 조회합니다
   * @param timeRange 시간 범위 (초 단위, 선택 사항, 기본값은 1시간)
   */
  async getSlowApiResponseTime(timeRange: number = 3600): Promise<TimeSeriesPoint[]> {
    try {
      console.log(`Slow API 응답 시간 조회: timeRange=${timeRange}`);
      const data = await this.dashboardQueryService.getSlowApiResponseTime(timeRange);
      return data;
    } catch (error) {
      console.error('Slow API 응답 시간 조회 중 오류 발생:', error);
      throw new Error('Slow API 응답 시간 조회에 실패했습니다');
    }
  }

  /**
   * CPU 사용률을 조회합니다
   * @param timeRange 시간 범위 (초 단위, 선택 사항, 기본값은 1시간)
   */
  async getCpuUsage(timeRange: number = 3600): Promise<TimeSeriesPoint[]> {
    try {
      console.log(`CPU 사용률 조회: timeRange=${timeRange}`);
      const data = await this.dashboardQueryService.getCpuUsage(timeRange);
      return data;
    } catch (error) {
      console.error('CPU 사용률 조회 중 오류 발생:', error);
      throw new Error('CPU 사용률 조회에 실패했습니다');
    }
  }

  /**
   * HTTP 에러율을 조회합니다
   * @param timeRange 시간 범위 (초 단위, 선택 사항, 기본값은 1시간)
   */
  async getHttpErrorRate(timeRange: number = 3600): Promise<TimeSeriesPoint[]> {
    try {
      console.log(`HTTP 에러율 조회: timeRange=${timeRange}`);
      const data = await this.dashboardQueryService.getHttpErrorRate(timeRange);
      return data;
    } catch (error) {
      console.error('HTTP 에러율 조회 중 오류 발생:', error);
      throw new Error('HTTP 에러율 조회에 실패했습니다');
    }
  }

  /**
   * 애플리케이션 상태 요약을 조회합니다
   */
  async getApplicationStatus(): Promise<Record<string, any>> {
    try {
      console.log('애플리케이션 상태 요약 조회');
      const status = await this.dashboardQueryService.getApplicationStatus();
      return status;
    } catch (error) {
      console.error('애플리케이션 상태 요약 조회 중 오류 발생:', error);
      throw new Error('애플리케이션 상태 요약 조회에 실패했습니다');
    }
  }
} 