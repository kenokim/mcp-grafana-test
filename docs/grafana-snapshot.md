# Grafana 대시보드 스냅샷 API 활용 가이드

Grafana 대시보드 스냅샷 API를 활용하여 대시보드의 특정 시점 상태를 저장하고 공유할 수 있습니다. 이 문서는 스냅샷 관련 API와 이를 활용한 기능 명세를 설명합니다.

## API 엔드포인트 목록

```
POST /api/snapshots - 새 스냅샷 생성
GET /api/snapshots - 스냅샷 목록 조회
GET /api/snapshots/:key - 특정 스냅샷 조회
DELETE /api/snapshots/:key - 스냅샷 삭제
```

## 기능 명세

### 1. 대시보드 스냅샷 생성 기능

대시보드의 현재 상태를 스냅샷으로 저장하는 기능입니다.

#### 요구사항

- 사용자가 지정한 대시보드의 현재 상태를 스냅샷으로 저장
- 스냅샷에 이름 부여 가능
- 스냅샷 만료 기간 설정 가능
- 외부 공유를 위한 URL 생성 옵션 제공

#### API 명세

```
POST /api/snapshots
```

**요청 본문**:
```json
{
  "dashboard": {
    // 대시보드 JSON 모델
    "title": "스냅샷 제목",
    "panels": [...],
    // 기타 대시보드 속성
  },
  "name": "My Dashboard Snapshot",
  "expires": 3600,
  "external": false,
  "key": "optional-custom-key"
}
```

**매개변수**:
- `dashboard`: 대시보드 JSON 모델 (필수)
- `name`: 스냅샷 이름 (선택, 기본값: 대시보드 제목)
- `expires`: 만료 시간(초) (선택, 0=영구 보관)
- `external`: 외부 스냅샷 서버 사용 여부 (선택, 기본값: false)
- `key`: 사용자 지정 키 (선택)

**응답**:
```json
{
  "key": "XXXXXXXX",
  "deleteKey": "YYYYYYYY",
  "url": "https://grafana.example.com/dashboard/snapshot/XXXXXXXX",
  "deleteUrl": "https://grafana.example.com/api/snapshots-delete/YYYYYYYY",
  "id": 123
}
```

#### 구현 상세

1. 사용자가 대시보드에서 "스냅샷 생성" 버튼 클릭
2. 스냅샷 이름과 만료 기간을 입력하는 폼 표시
3. 사용자 입력을 바탕으로 API 요청 생성 및 전송
4. 응답으로 받은 URL을 사용자에게 표시하고, 스냅샷 관리 페이지에 링크 추가

```typescript
async function createDashboardSnapshot(
  dashboard: any, 
  name: string, 
  expires: number = 0
): Promise<SnapshotResponse> {
  try {
    const response = await axios.post('/api/snapshots', {
      dashboard,
      name,
      expires
    });
    return response.data;
  } catch (error) {
    console.error('스냅샷 생성 실패:', error);
    throw new Error('대시보드 스냅샷을 생성하는데 실패했습니다');
  }
}
```

### 2. 스냅샷 목록 조회 기능

생성된 모든 스냅샷 목록을 조회하는 기능입니다.

#### 요구사항

- 사용자가 생성한 모든 스냅샷 목록 표시
- 페이지네이션 지원
- 이름, 생성일, 만료일로 정렬 가능
- 검색 기능 제공

#### API 명세

```
GET /api/snapshots
```

**매개변수**:
- `query`: 검색어 (선택)
- `limit`: 반환할 최대 스냅샷 수 (선택, 기본값: 1000)

**응답**:
```json
[
  {
    "id": 123,
    "name": "My Dashboard Snapshot",
    "key": "XXXXXXXX",
    "orgId": 1,
    "userId": 42,
    "external": false,
    "externalUrl": "",
    "expires": "2023-12-31T23:59:59Z",
    "created": "2023-01-01T00:00:00Z",
    "updated": "2023-01-01T00:00:00Z"
  },
  // 추가 스냅샷 항목
]
```

#### 구현 상세

1. 스냅샷 관리 페이지에서 API 호출
2. 반환된 스냅샷 목록을 테이블 형태로 표시
3. 정렬, 페이지네이션, 검색 기능 제공
4. 각 스냅샷 항목에 보기, 삭제 액션 버튼 추가

```typescript
async function getSnapshotsList(
  query?: string,
  limit: number = 1000
): Promise<Snapshot[]> {
  try {
    const params: Record<string, string | number> = { limit };
    if (query) params.query = query;
    
    const response = await axios.get('/api/snapshots', { params });
    return response.data;
  } catch (error) {
    console.error('스냅샷 목록 조회 실패:', error);
    throw new Error('스냅샷 목록을 가져오는데 실패했습니다');
  }
}
```

### 3. 특정 스냅샷 조회 기능

스냅샷 키를 사용하여 특정 스냅샷의 상세 정보를 조회하는 기능입니다.

#### 요구사항

- 스냅샷 키를 사용하여 특정 스냅샷 조회
- 스냅샷 대시보드 데이터 및 메타데이터 표시
- 공유 링크 생성 기능 제공

#### API 명세

```
GET /api/snapshots/:key
```

**매개변수**:
- `key`: 스냅샷 키 (필수, URL 경로에 포함)

**응답**:
```json
{
  "meta": {
    "isSnapshot": true,
    "type": "snapshot",
    "canSave": false,
    "canEdit": false,
    "canAdmin": false,
    "canStar": false,
    "slug": "",
    "expires": "2023-12-31T23:59:59Z",
    "created": "2023-01-01T00:00:00Z"
  },
  "dashboard": {
    // 대시보드 JSON 모델
    "title": "My Dashboard Snapshot",
    "panels": [...],
    // 기타 대시보드 속성
  }
}
```

#### 구현 상세

1. 스냅샷 URL 접근 또는 스냅샷 목록에서 항목 선택
2. API를 호출하여 스냅샷 데이터 가져오기
3. 스냅샷 데이터를 사용하여 대시보드 렌더링
4. 스냅샷 메타데이터(생성일, 만료일 등) 표시
5. 스냅샷 공유 버튼 제공

```typescript
async function getSnapshotByKey(key: string): Promise<SnapshotData> {
  try {
    const response = await axios.get(`/api/snapshots/${key}`);
    return response.data;
  } catch (error) {
    console.error('스냅샷 조회 실패:', error);
    throw new Error('스냅샷을 가져오는데 실패했습니다');
  }
}
```

### 4. 스냅샷 삭제 기능

불필요한 스냅샷을 삭제하는 기능입니다.

#### 요구사항

- 스냅샷 키를 사용하여 특정 스냅샷 삭제
- 삭제 전 사용자 확인 프롬프트 표시
- 삭제 성공/실패 알림 표시

#### API 명세

```
DELETE /api/snapshots/:key
```

**매개변수**:
- `key`: 스냅샷 키 (필수, URL 경로에 포함)

**응답**:
- 성공 시 HTTP 상태 코드 200
- 실패 시 HTTP 상태 코드 4xx/5xx와 오류 메시지

#### 구현 상세

1. 스냅샷 목록 또는 상세 보기에서 삭제 버튼 클릭
2. 사용자에게 삭제 확인 프롬프트 표시
3. 확인 시 API 호출하여 스냅샷 삭제
4. 삭제 결과에 따라 적절한 알림 표시
5. 스냅샷 목록 갱신

```typescript
async function deleteSnapshot(key: string): Promise<boolean> {
  try {
    await axios.delete(`/api/snapshots/${key}`);
    return true;
  } catch (error) {
    console.error('스냅샷 삭제 실패:', error);
    throw new Error('스냅샷을 삭제하는데 실패했습니다');
  }
}
```

## 사용자 인터페이스 요구사항

### 스냅샷 관리 페이지

1. 스냅샷 목록 테이블
   - 열: 이름, 생성일, 만료일, 액션(보기, 삭제)
   - 정렬, 페이지네이션, 검색 컨트롤

2. 스냅샷 생성 버튼
   - 클릭 시 스냅샷 생성 모달 표시

3. 스냅샷 생성 모달
   - 스냅샷 이름 입력 필드
   - 만료 기간 선택 (1시간, 1일, 1주, 1개월, 영구 보관)
   - 외부 공유 옵션 체크박스 (선택 사항)
   - 생성 및 취소 버튼

### 스냅샷 상세 페이지

1. 스냅샷 메타데이터 헤더
   - 스냅샷 이름
   - 생성일 및 만료일
   - 원본 대시보드 링크 (가능한 경우)

2. 스냅샷 공유 옵션
   - 공유 URL 복사 버튼
   - 내장 코드 복사 버튼

3. 스냅샷 대시보드 뷰
   - 원본 대시보드와 동일한 레이아웃으로 패널 표시
   - 모든 패널은 스냅샷 생성 시점의 데이터 표시
   - 대시보드 컨트롤은 비활성화

## 오류 처리

1. 스냅샷 생성 실패
   - 원인에 따른 오류 메시지 표시
   - 재시도 버튼 제공

2. 스냅샷 조회 실패
   - "스냅샷을 찾을 수 없음" 메시지 표시
   - 스냅샷 목록으로 돌아가는 링크 제공

3. 스냅샷 삭제 실패
   - 원인에 따른 오류 메시지 표시
   - 재시도 버튼 제공

## 성능 고려사항

1. 대시보드 스냅샷 생성 시 서버 부하 최소화
   - 클라이언트에서 필요한 데이터만 포함하여 요청
   - 대용량 패널 데이터 압축 고려

2. 스냅샷 목록 페이지네이션
   - 한 번에 최대 50개 항목만 표시
   - 무한 스크롤 또는 페이지 번호 탐색 제공

3. 스냅샷 캐싱
   - 자주 조회되는 스냅샷 클라이언트 측 캐싱
   - 캐시 만료 시간 설정 (1시간 권장)

## 구현 예제

### 스냅샷 모듈 인터페이스 정의

```typescript
interface SnapshotRequest {
  dashboard: any;
  name?: string;
  expires?: number;
  external?: boolean;
  key?: string;
}

interface SnapshotResponse {
  key: string;
  deleteKey: string;
  url: string;
  deleteUrl: string;
  id: number;
}

interface Snapshot {
  id: number;
  name: string;
  key: string;
  orgId: number;
  userId: number;
  external: boolean;
  externalUrl: string;
  expires: string;
  created: string;
  updated: string;
}

interface SnapshotData {
  meta: {
    isSnapshot: boolean;
    type: string;
    canSave: boolean;
    canEdit: boolean;
    canAdmin: boolean;
    canStar: boolean;
    slug: string;
    expires: string;
    created: string;
  };
  dashboard: any;
}
```

### 스냅샷 서비스 구현

```typescript
class SnapshotService {
  private readonly baseUrl = '/api/snapshots';
  
  async createSnapshot(request: SnapshotRequest): Promise<SnapshotResponse> {
    try {
      const response = await axios.post(this.baseUrl, request);
      return response.data;
    } catch (error) {
      console.error('스냅샷 생성 실패:', error);
      throw new Error('대시보드 스냅샷을 생성하는데 실패했습니다');
    }
  }
  
  async getSnapshots(query?: string, limit: number = 1000): Promise<Snapshot[]> {
    try {
      const params: Record<string, string | number> = { limit };
      if (query) params.query = query;
      
      const response = await axios.get(this.baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error('스냅샷 목록 조회 실패:', error);
      throw new Error('스냅샷 목록을 가져오는데 실패했습니다');
    }
  }
  
  async getSnapshotByKey(key: string): Promise<SnapshotData> {
    try {
      const response = await axios.get(`${this.baseUrl}/${key}`);
      return response.data;
    } catch (error) {
      console.error('스냅샷 조회 실패:', error);
      throw new Error('스냅샷을 가져오는데 실패했습니다');
    }
  }
  
  async deleteSnapshot(key: string): Promise<boolean> {
    try {
      await axios.delete(`${this.baseUrl}/${key}`);
      return true;
    } catch (error) {
      console.error('스냅샷 삭제 실패:', error);
      throw new Error('스냅샷을 삭제하는데 실패했습니다');
    }
  }
}