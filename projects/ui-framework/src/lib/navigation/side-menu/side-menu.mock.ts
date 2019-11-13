import { SideMenuOption } from './side-menu-option/side-menu-option.interface';
import { Icons } from '../../icons/icons.enum';
import { makeArray, mockText, simpleUID } from 'bob-style';

export const getSideMenuOptionsMock: SideMenuOption[] = makeArray(5).map(i => ({
    id: simpleUID(),
    displayName: mockText(1),
    icon: Icons.folder,
    actions: [
      {
        label: mockText(1),
        action: ($event) => {
          console.log($event);
        },
      }
    ],
  })) as SideMenuOption[];
