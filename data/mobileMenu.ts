import type { MobileMenuItem } from '@/types/navigation';

export type { MobileMenuItem, MobileSubmenuItem } from '@/types/navigation';

export const menuData: MobileMenuItem[] = [
  {
    id: 1,
    label: 'Home',
    submenu: [{ id: 11, label: 'Homepage', href: '/' }],
  },
];
