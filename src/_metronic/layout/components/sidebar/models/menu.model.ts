export interface SubMenu {
  name: string;
  description: string;
  url: string;
  sequenceNumber: number;
  appSubMenuId: string;
}

export interface Menu {
  name: string;
  description: string;
  hasSubMenus: boolean;
  url: string | null;
  fontAwesomeIcon: string | null;
  appSubMenus: SubMenu[] | null;
}

export interface ConstructMenuResponse {
  error: boolean;
  data: {
    appMenus: Menu[];
  };
}
