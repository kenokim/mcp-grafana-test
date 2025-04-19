## 프로젝트 구성
- docker compose up -d 로 간략하게 테스트 환경을 구성할 수 있다.
- 다음과 같이 구성되어 있다.
- target-api: grafana 에서 모니터링할 대상이다.
- prometheus: grafana 에서 가져올 데이터베이스이다.
- grafana: 대시보드를 볼 수 있다.
- grafana-mcp-server: grafana 에 붙어 대시보드를 확인하는 mcp api 서버이다. (typescript)

