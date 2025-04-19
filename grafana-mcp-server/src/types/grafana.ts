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