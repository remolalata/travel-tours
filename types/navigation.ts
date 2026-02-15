export interface MobileSubmenuItem {
  id: number;
  label: string;
  href: string;
}

export interface MobileMenuItem {
  id: number;
  label: string;
  submenu: MobileSubmenuItem[];
}
