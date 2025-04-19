# Grafana API Client

Grafana API를 호출하는 TypeScript 예제 프로젝트입니다. 이 프로젝트는 Grafana의 다양한 API를 호출하고 결과를 콘솔에 출력합니다.

## 기능

- Grafana 헬스 체크
- 대시보드 목록 조회 및 상세 정보 조회
- 폴더 목록 조회
- 데이터소스 목록 조회 및 상세 정보 조회
- 사용자 정보 조회
- 알림 규칙 조회
- 팀 목록 조회
- 스냅샷 목록 조회
- 조직 목록 조회

## 설치 방법

1. 프로젝트 클론
```bash
git clone <repository-url>
cd grafana-api-client
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
`.env.example` 파일을 `.env` 파일로 복사하고 Grafana 접속 정보를 설정합니다.
```bash
cp .env.example .env
```

4. `.env` 파일 편집
```
GRAFANA_URL=http://localhost:3000
GRAFANA_USERNAME=admin
GRAFANA_PASSWORD=admin
```

## 실행 방법

### 개발 모드로 실행

```bash
npm run dev
```

### 빌드 후 실행

```bash
npm run build
npm start
```

## 주요 파일 구조

- `src/index.ts`: 메인 스크립트 파일
- `src/services/grafana-api.ts`: Grafana API 호출 서비스
- `src/types/grafana.ts`: Grafana API 응답 타입 정의
- `src/utils/logger.ts`: 로깅 유틸리티

## 요구사항

- Node.js 14 이상
- TypeScript 4.5 이상
- Grafana 인스턴스 접근 권한

## 참고 자료

- [Grafana HTTP API 문서](https://grafana.com/docs/grafana/latest/http_api/)
- [Axios 문서](https://axios-http.com/docs/intro) 