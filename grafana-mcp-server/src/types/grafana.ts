/**
 * Grafana API 관련 인터페이스 정의
 */

export interface Dashboard {
  id: number;
  uid: string;
  title: string;
  url: string;
  type: string;
  tags: string[];
  isStarred: boolean;
}

export interface DashboardDetail {
  dashboard: {
    id: number;
    uid: string;
    title: string;
    version: number;
    panels: Panel[];
    time: TimeRange;
    [key: string]: any;
  };
  meta: {
    isStarred: boolean;
    url: string;
    folderId: number;
    folderTitle: string;
    canSave: boolean;
    canEdit: boolean;
    canAdmin: boolean;
    canStar: boolean;
    canDelete: boolean;
    [key: string]: any;
  };
}

export interface Panel {
  id: number;
  type: string;
  title: string;
  targets?: PanelTarget[];
  snapshotData?: any;
  [key: string]: any;
}

export interface PanelTarget {
  refId: string;
  expr: string;
  [key: string]: any;
}

export interface TimeRange {
  from: string;
  to: string;
  raw?: {
    from: string;
    to: string;
  };
}

export interface PanelDataQuery {
  refId: string;
  datasource: {
    uid: string;
    type: string;
  };
  expr: string;
  instant: boolean;
  range: boolean;
  format?: string;
  [key: string]: any;
}

export interface PanelDataRequest {
  queries: PanelDataQuery[];
  range: TimeRange;
  from?: string | number;
  to?: string | number;
}

export interface PanelDataResponse {
  results: {
    [refId: string]: {
      frames: Array<{
        schema: {
          fields: Array<{
            name: string;
            type: string;
          }>;
        };
        data: {
          values: Array<any[]>;
        };
      }>;
    };
  };
}

export interface SnapshotRequest {
  dashboard: {
    id?: number;
    uid?: string;
    title: string;
    panels: Panel[];
    time: TimeRange;
    [key: string]: any;
  };
  name: string;
  expires: number;
}

export interface SnapshotResponse {
  key: string;
  deleteKey: string;
  url: string;
  deleteUrl: string;
  id: number;
}

export interface Snapshot {
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

export interface SnapshotDetail {
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
  dashboard: {
    id: number | null;
    title: string;
    panels: Panel[];
    time: TimeRange;
    [key: string]: any;
  };
}

export interface GrafanaDashboard {
  id: number;
  uid: string;
  title: string;
  url: string;
  type: string;
  tags: string[];
  isStarred: boolean;
  uri: string;
  folderUid?: string;
  folderTitle?: string;
  folderUrl?: string;
}

export interface GrafanaFolder {
  id: number;
  uid: string;
  title: string;
  url: string;
  hasAcl: boolean;
  canSave: boolean;
  canEdit: boolean;
  canAdmin: boolean;
  canDelete: boolean;
  createdBy: string;
  created: string;
  updatedBy: string;
  updated: string;
  version: number;
}

export interface GrafanaDataSource {
  id: number;
  orgId: number;
  name: string;
  type: string;
  typeName: string;
  typeLogoUrl: string;
  access: string;
  url: string;
  password: string;
  user: string;
  database: string;
  basicAuth: boolean;
  isDefault: boolean;
  jsonData: any;
  readOnly: boolean;
}

export interface GrafanaUser {
  id: number;
  email: string;
  name: string;
  login: string;
  theme: string;
  orgId: number;
  isGrafanaAdmin: boolean;
  isDisabled: boolean;
  isExternal: boolean;
  authLabels: string[];
  updatedAt: string;
  createdAt: string;
}

export interface GrafanaAlert {
  id: number;
  dashboardId: number;
  dashboardUid: string;
  dashboardSlug: string;
  panelId: number;
  name: string;
  state: string;
  newStateDate: string;
  evalDate: string;
  executionError: string;
  url: string;
}

export interface GrafanaOrg {
  id: number;
  name: string;
  address: {
    address1: string;
    address2: string;
    city: string;
    zipCode: string;
    state: string;
    country: string;
  };
}

export interface GrafanaSearchResponse {
  totalRows: number;
  dashboards: GrafanaDashboard[];
  tags: string[];
  count: number;
}

export interface GrafanaAnnotation {
  id: number;
  alertId: number;
  alertName: string;
  dashboardId: number;
  panelId: number;
  userId: number;
  newState: string;
  prevState: string;
  created: number;
  updated: number;
  time: number;
  timeEnd: number;
  text: string;
  tags: string[];
  login: string;
  email: string;
  avatarUrl: string;
  data: any;
}

export interface GrafanaHealthResponse {
  commit: string;
  database: string;
  version: string;
}

export interface GrafanaTeam {
  id: number;
  orgId: number;
  name: string;
  email: string;
  avatarUrl: string;
  memberCount: number;
  permission: number;
}

export interface GrafanaAlertRule {
  id: number;
  dashboardId: number;
  panelId: number;
  name: string;
  state: string;
  newStateDate: string;
  evalDate: string;
  evalData: any;
  executionError: string;
  url: string;
}

export interface GrafanaDashboardMetaResponse {
  slug: string;
  dashboard: any;
  meta: {
    isStarred: boolean;
    url: string;
    folderId: number;
    folderUid: string;
    folderTitle: string;
    folderUrl: string;
    provisioned: boolean;
    provisionedExternalId: string;
  };
} 