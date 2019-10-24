import { SelectGroupOption } from '../list.interface';

export const selectOptionsMock: SelectGroupOption[] = [
  {
    groupName: 'Basic info',
    key: 'root',
    options: [
      {
        value: 'First name',
        id: '/root/firstName',
        selected: false
      },
      {
        value: 'Last name',
        id: '/root/latName',
        selected: false
      },
      {
        id: 'basic/fullName',
        value: 'Full name'
      },
      {
        id: 'basic/email',
        value: 'E-mail'
      }
    ]
  },
  {
    groupName: 'Personal',
    key: 'personal',
    options: [
      {
        value: 'Personal email',
        id: '/personal/personalEmail',
        selected: false
      },
      {
        value: 'Personal phone',
        id: '/personal/personalPhone',
        selected: false
      },
      {
        value: 'Personal mobile',
        id: '/personal/personalMobile',
        selected: false
      }
    ]
  },
  {
    groupName: 'Work',
    key: 'work',
    options: [
      {
        value: 'Title',
        id: '/work/title',
        selected: false
      },
      {
        id: 'work/team',
        value: 'Team'
      },
      {
        value: 'Reports to',
        id: '/work/reportsTo',
        selected: false
      },
      {
        value: 'Start date',
        id: '/work/startDate',
        selected: false
      },
      {
        value: 'Site',
        id: '/work/siteId',
        selected: false
      }
    ]
  },
  {
    groupName: 'Address',
    key: 'address',
    options: [
      {
        value: 'City',
        id: '/address/city',
        selected: false
      },
      {
        value: 'Country',
        id: '/address/country',
        selected: false
      },
      {
        value: 'State',
        id: '/address/state',
        selected: false
      }
    ]
  }
];
