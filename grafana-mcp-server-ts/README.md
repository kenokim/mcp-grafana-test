# Grafana API Server

이 프로젝트는 Grafana API를 통해 대시보드 목록 조회, 대시보드 상세 정보 조회, 스냅샷 생성 및 조회를 수행하는 REST API 서버입니다.

## 기능

- 대시보드 목록 조회
- 대시보드 상세 정보 조회
- 패널 데이터 조회
- 스냅샷 생성 및 조회
- 전체 워크플로우: 대시보드 조회부터 스냅샷 생성까지

## 시작하기

### 필수 조건

- Node.js (>= 14.x)
- Grafana 서버 (8.x 이상)
- Grafana API 키

### 설치

1. 저장소 복제:

```bash
git clone <repository-url>
cd grafana-mcp-server
```

2. 의존성 설치:

```bash
npm install
```

3. 환경 설정:

`.env.example` 파일을 `.env`로 복사하고 필요한 설정을 변경합니다:

```bash
cp .env.example .env
```

`.env` 파일을 편집하여 Grafana URL 및 API 키를 설정합니다:

```
GRAFANA_URL=http://your-grafana-instance:3000
GRAFANA_API_KEY=your-grafana-api-key
PORT=4000
```

### 실행

개발 모드로 실행:

```bash
npm run dev
```

빌드 후 실행:

```bash
npm run build
npm start
```

서버가 시작되면 다음 URL에서 API 문서를 확인할 수 있습니다:

```
http://localhost:4000/api-docs
```

## API 엔드포인트

서버는 다음과 같은 API 엔드포인트를 제공합니다:

### 대시보드

- `GET /api/dashboards` - 대시보드 목록 조회
- `GET /api/dashboards/:uid` - 대시보드 상세 정보 조회

### 패널 데이터

- `POST /api/ds/query` - 패널 데이터 조회

### 스냅샷

- `POST /api/snapshots` - 스냅샷 생성
- `GET /api/snapshots` - 스냅샷 목록 조회
- `GET /api/snapshots/:key` - 특정 스냅샷 조회
- `GET /api/snapshots-delete/:deleteKey` - 스냅샷 삭제

### 전체 워크플로우

- `POST /api/dashboard-snapshot` - 대시보드 조회부터 스냅샷 생성까지의 전체 워크플로우 실행

## 사용 예시

### 대시보드 목록 조회

```bash
curl -X GET http://localhost:4000/api/dashboards
```

### 대시보드 상세 정보 조회

```bash
curl -X GET http://localhost:4000/api/dashboards/AbCdEfGhI
```

### 스냅샷 생성

```bash
curl -X POST http://localhost:4000/api/dashboard-snapshot \
  -H "Content-Type: application/json" \
  -d '{
    "dashboardUid": "AbCdEfGhI",
    "snapshotName": "My Dashboard Snapshot",
    "expires": 3600
  }'
```

## 라이선스

MIT 