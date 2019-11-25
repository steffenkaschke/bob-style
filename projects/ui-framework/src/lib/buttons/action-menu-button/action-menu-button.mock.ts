import { MenuItem } from 'bob-style';

export const menuItemsMock: MenuItem[] = [
    {
      label: 'menu item 1',
      action: $event => console.log('menu item 1 clicked', $event)
    },
    {
      label: 'menu item 2',
      action: $event => console.log('menu item 2 clicked', $event)
    }
  ];

