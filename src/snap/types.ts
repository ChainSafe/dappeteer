export interface InstallSnapResult {
  accounts: [];
  permissions: [
    {
      id: string;
      parentCapability: string;
      invoker: string;
      caveats: null;
      date: number;
    }
  ];
  snaps: {
    [id: string]: {
      permissionName: string;
      id: string;
      initialPermissions: Object;
      version: string;
    };
  };
}

export type NotificationItem = { message: string };
export type NotificationList = NotificationItem[];
