import { GrafanaApiService } from './services/grafana-api';
import { Logger } from './utils/logger';
import { GrafanaDashboard } from './types/grafana';

// 로거 생성
const logger = new Logger('GrafanaApiDemo');

// Grafana API 서비스 인스턴스 생성
const grafanaService = new GrafanaApiService();

// API 호출 결과를 출력하는 함수
function printApiResult(title: string, data: any): void {
  logger.info(`===== ${title} =====`);
  console.log(JSON.stringify(data, null, 2));
  console.log('\n');
}

// 모든 API 호출을 실행하는 함수
async function runAllApiCalls(): Promise<void> {
  try {
    logger.info('Grafana API 호출 데모 시작');
    
    // 1. 헬스 체크
    try {
      const health = await grafanaService.checkHealth();
      printApiResult('Grafana 헬스 체크', health);
    } catch (error) {
      logger.error('헬스 체크 실패', error);
    }
    
    // 2. 대시보드 검색
    try {
      const dashboardsResponse = await grafanaService.searchDashboards();
      printApiResult('대시보드 목록', dashboardsResponse);
      
      // 대시보드 배열이 있는지 확인하고 첫 번째 대시보드 상세 정보 조회
      const dashboards = Array.isArray(dashboardsResponse) 
        ? dashboardsResponse 
        : dashboardsResponse.dashboards || [];
        
      if (dashboards.length > 0) {
        const firstDashboard = dashboards[0] as GrafanaDashboard;
        const dashboardDetail = await grafanaService.getDashboardByUid(firstDashboard.uid);
        printApiResult(`대시보드 상세 정보: ${firstDashboard.title}`, dashboardDetail);
      }
    } catch (error) {
      logger.error('대시보드 검색 실패', error);
    }
    
    // 3. 폴더 목록 조회
    try {
      const folders = await grafanaService.getFolders();
      printApiResult('폴더 목록', folders);
    } catch (error) {
      logger.error('폴더 목록 조회 실패', error);
    }
    
    // 4. 데이터소스 목록 조회
    try {
      const dataSources = await grafanaService.getDataSources();
      printApiResult('데이터소스 목록', dataSources);
      
      // 데이터소스가 있으면 첫 번째 데이터소스 상세 정보 조회
      if (dataSources && dataSources.length > 0) {
        const firstDataSource = dataSources[0];
        const dataSourceDetail = await grafanaService.getDataSourceById(firstDataSource.id);
        printApiResult(`데이터소스 상세 정보: ${firstDataSource.name}`, dataSourceDetail);
      }
    } catch (error) {
      logger.error('데이터소스 목록 조회 실패', error);
    }
    
    // 5. 현재 사용자 정보 조회
    try {
      const currentUser = await grafanaService.getCurrentUser();
      printApiResult('현재 사용자 정보', currentUser);
    } catch (error) {
      logger.error('현재 사용자 정보 조회 실패', error);
    }
    
    // 6. 모든 사용자 조회 (관리자 권한 필요)
    try {
      const users = await grafanaService.getUsers();
      printApiResult('사용자 목록', users);
    } catch (error) {
      logger.error('사용자 목록 조회 실패', error);
    }
    
    // 7. 알림 규칙 조회
    try {
      const alertRules = await grafanaService.getAlertRules();
      printApiResult('알림 규칙 목록', alertRules);
    } catch (error) {
      logger.error('알림 규칙 목록 조회 실패', error);
    }
    
    // 8. 팀 목록 조회
    try {
      const teams = await grafanaService.getTeams();
      printApiResult('팀 목록', teams);
    } catch (error) {
      logger.error('팀 목록 조회 실패', error);
    }
    
    // 9. 스냅샷 목록 조회
    try {
      const snapshots = await grafanaService.getSnapshots();
      printApiResult('스냅샷 목록', snapshots);
    } catch (error) {
      logger.error('스냅샷 목록 조회 실패', error);
    }
    
    // 10. 조직 목록 조회 (관리자 권한 필요)
    try {
      const organizations = await grafanaService.getOrganizations();
      printApiResult('조직 목록', organizations);
    } catch (error) {
      logger.error('조직 목록 조회 실패', error);
    }

    logger.info('Grafana API 호출 데모 완료');
  } catch (error) {
    logger.error('API 호출 중 오류 발생', error);
  }
}

// 메인 함수 실행
runAllApiCalls().catch((error) => {
  logger.error('프로그램 실행 중 오류 발생', error);
  // 오류 발생 시 종료 코드 1로 종료
  // Node.js 환경에서만 실행되는 코드
  if (typeof process !== 'undefined' && process.exit) {
    process.exit(1);
  }
}); 