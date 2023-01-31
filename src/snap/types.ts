export interface InstallSnapResult {
  [id: string]: {
    blocked: boolean;
    enabled: boolean;
    permissionName: string;
    id: string;
    initialPermissions: Object;
    version: string;
  };
}

export type NotificationItem = { message: string };
export type NotificationList = NotificationItem[];
