# Grafana 대시보드 API 목록

Grafana는 대시보드 관리 및 모니터링을 위한 다양한 API를 제공합니다. 아래는 대시보드 관련 주요 API 20개를 정리한 내용입니다.

## 1. 대시보드 목록 검색 

```
GET /api/search
```
- **설명**: 대시보드와 폴더를 검색합니다
- **파라미터**: 
  - `query`: 검색어 
  - `tag`: 태그
  - `type`: 'dash-db' (대시보드) 또는 'dash-folder' (폴더)
  - `limit`: 반환할 최대 항목 수
- **응답**: 대시보드/폴더 목록 배열
- **사용 사례**: 대시보드 목록 조회, 특정 태그의 대시보드 검색

## 2. 대시보드 상세 정보 조회

```
GET /api/dashboards/uid/:uid
```
- **설명**: 특정 UID를 가진 대시보드의 상세 정보를 조회합니다
- **파라미터**: 
  - `uid`: 대시보드 고유 식별자
- **응답**: 대시보드 JSON 및 메타데이터
- **사용 사례**: 대시보드 메타데이터 및 패널 정보 확인

## 3. 대시보드 생성/업데이트

```
POST /api/dashboards/db
```
- **설명**: 대시보드 생성 또는 업데이트
- **요청 본문**: 
  - `dashboard`: 대시보드 JSON 모델
  - `folderId`: 폴더 ID
  - `overwrite`: 기존 대시보드 덮어쓰기 여부
- **응답**: 생성/업데이트된 대시보드 ID, UID 등
- **사용 사례**: 프로그래밍 방식으로 대시보드 생성 또는 변경

## 4. 대시보드 삭제

```
DELETE /api/dashboards/uid/:uid
```
- **설명**: 특정 UID를 가진 대시보드를 삭제합니다
- **파라미터**: 
  - `uid`: 대시보드 고유 식별자
- **응답**: 성공 메시지
- **사용 사례**: 불필요한 대시보드 제거

## 5. 대시보드 태그 조회

```
GET /api/dashboards/tags
```
- **설명**: 모든 대시보드 태그 목록을 조회합니다
- **응답**: 태그 목록
- **사용 사례**: 태그 기반 필터링 UI 구현

## 6. 대시보드 패널 쿼리 데이터 조회

```
POST /api/datasources/proxy/:datasourceId/api/v1/query_range
```
- **설명**: 데이터소스 API를 통해 패널 쿼리 데이터 조회
- **파라미터**:
  - `datasourceId`: 데이터소스 ID
- **요청 본문**: 
  - `query`: Prometheus 쿼리 표현식
  - `start`, `end`: 시간 범위 (Unix 타임스탬프)
  - `step`: 데이터 포인트 간격
- **응답**: 타임시리즈 데이터
- **사용 사례**: 커스텀 대시보드 위젯 구현

## 7. 대시보드 권한 관리

```
POST /api/dashboards/uid/:uid/permissions
```
- **설명**: 특정 대시보드의 권한을 업데이트합니다
- **파라미터**: 
  - `uid`: 대시보드 고유 식별자
- **요청 본문**: 권한 설정 JSON
- **응답**: 성공 메시지
- **사용 사례**: 대시보드 접근 권한 변경

## 8. 대시보드 버전 조회

```
GET /api/dashboards/uid/:uid/versions
```
- **설명**: 대시보드의 이전 버전 목록을 조회합니다
- **파라미터**: 
  - `uid`: 대시보드 고유 식별자
  - `limit`: 반환할 최대 버전 수
- **응답**: 버전 목록
- **사용 사례**: 대시보드 변경 이력 확인

## 9. 특정 버전의 대시보드 조회

```
GET /api/dashboards/uid/:uid/versions/:id
```
- **설명**: 특정 버전의 대시보드 정보를 조회합니다
- **파라미터**: 
  - `uid`: 대시보드 고유 식별자
  - `id`: 버전 ID
- **응답**: 특정 버전의 대시보드 JSON
- **사용 사례**: 이전 대시보드 구성 확인

## 10. 대시보드 버전 복원

```
POST /api/dashboards/id/:dashboardId/restore
```
- **설명**: 특정 버전의 대시보드로 복원합니다
- **파라미터**: 
  - `dashboardId`: 대시보드 ID
- **요청 본문**: 
  - `version`: 복원할 버전 번호
- **응답**: 복원된 대시보드 정보
- **사용 사례**: 잘못된 변경 후 이전 버전으로 롤백

## 11. 대시보드 폴더 목록 조회

```
GET /api/folders
```
- **설명**: 모든 대시보드 폴더 목록을 조회합니다
- **파라미터**: 
  - `limit`: 반환할 최대 폴더 수
- **응답**: 폴더 목록
- **사용 사례**: 대시보드 구성 및 네비게이션

## 12. 폴더 생성

```
POST /api/folders
```
- **설명**: 새로운 폴더를 생성합니다
- **요청 본문**: 
  - `title`: 폴더 제목
  - `uid`: 폴더 UID (선택 사항)
- **응답**: 생성된 폴더 정보
- **사용 사례**: 대시보드 구조화 및 분류

## 13. 폴더 상세 정보 조회

```
GET /api/folders/:uid
```
- **설명**: 특정 UID를 가진 폴더의 상세 정보를 조회합니다
- **파라미터**: 
  - `uid`: 폴더 고유 식별자
- **응답**: 폴더 정보
- **사용 사례**: 폴더 메타데이터 확인

## 14. 폴더 내 대시보드 조회

```
GET /api/search?folderIds=:id
```
- **설명**: 특정 폴더에 포함된 대시보드 목록을 조회합니다
- **파라미터**: 
  - `folderIds`: 폴더 ID
- **응답**: 해당 폴더의 대시보드 목록
- **사용 사례**: 폴더별 대시보드 관리

## 15. 대시보드 폴더 이동

```
POST /api/dashboards/uid/:uid/move
```
- **설명**: 대시보드를 다른 폴더로 이동합니다
- **파라미터**: 
  - `uid`: 대시보드 고유 식별자
- **요청 본문**: 
  - `folderId`: 대상 폴더 ID
  - `folderUid`: 대상 폴더 UID (선택 사항)
- **응답**: 성공 메시지
- **사용 사례**: 대시보드 구성 정리

## 16. 대시보드 스냅샷 생성

```
POST /api/snapshots
```
- **설명**: 현재 대시보드의 스냅샷을 생성합니다
- **요청 본문**: 
  - `dashboard`: 대시보드 JSON
  - `name`: 스냅샷 이름
  - `expires`: 만료 시간
- **응답**: 생성된 스냅샷 URL 및 정보
- **사용 사례**: 특정 시점의 대시보드 상태 보존

## 17. 대시보드 스냅샷 조회

```
GET /api/dashboard/snapshots
```
- **설명**: 모든 대시보드 스냅샷 목록을 조회합니다
- **응답**: 스냅샷 목록
- **사용 사례**: 생성된 스냅샷 관리

## 18. 스냅샷 삭제

```
DELETE /api/snapshots/:key
```
- **설명**: 특정 키를 가진 스냅샷을 삭제합니다
- **파라미터**: 
  - `key`: 스냅샷 키
- **응답**: 성공 메시지
- **사용 사례**: 불필요한 스냅샷 제거

## 19. 대시보드 임포트

```
POST /api/dashboards/import
```
- **설명**: JSON 파일에서 대시보드를 임포트합니다
- **요청 본문**: 
  - `dashboard`: 대시보드 JSON
  - `folderId`: 폴더 ID
  - `inputs`: 데이터소스 매핑 정보
- **응답**: 임포트된 대시보드 정보
- **사용 사례**: 대시보드 템플릿 적용 및 공유

## 20. 대시보드 라이브러리 패널 관리

```
GET /api/library-panels
```
- **설명**: 재사용 가능한 라이브러리 패널 목록을 조회합니다
- **파라미터**: 
  - `folderFilter`: 폴더 필터링
- **응답**: 라이브러리 패널 목록
- **사용 사례**: 재사용 가능한 패널 관리

## 출처

이 정보는 다음 Grafana 공식 문서를 참조하여 작성되었습니다:
- [Grafana HTTP API 문서](https://grafana.com/docs/grafana/latest/developers/http_api/)
- [Grafana 대시보드 HTTP API](https://grafana.com/docs/grafana/latest/developers/http_api/dashboard/)
- [Grafana 폴더/대시보드 검색 API](https://grafana.com/docs/grafana/latest/developers/http_api/folder_dashboard_search/)
- [Grafana 설정 문서](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/)
- [Grafana Dashboard JSON 모델](https://grafana.com/docs/grafana/latest/developers/http_api/dashboard/#dashboard-json-model)
