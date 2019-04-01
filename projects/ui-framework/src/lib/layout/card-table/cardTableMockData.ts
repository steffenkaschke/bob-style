import { CardTableMetaData, CardTableData } from './card-table.interface';
import { ChipComponent } from '../../buttons-indicators/chips/chip/chip.component';
import { ButtonComponent } from '../../buttons-indicators/buttons/button/button.component';
import { TestAvatarUsernameComponent } from './test-avatar-username.component';


export const CardTableMockMetaData: CardTableMetaData = [
  {
    id: 1,
    name: 'Requested For',
    width: 25,
    sortablle: false
  },
  {
    id: 2,
    name: 'Subject',
    textStyle: {
      fontWeight: '500'
    },
    sortablle: false
  },
  {
    id: 3,
    name: 'Requested by',
    sortablle: false,
  },
  {
    id: 4,
    name: 'Assignee',
    sortablle: false
  },
  {
    id: 5,
    name: 'Status',
    width: 15,
    align: 'right',
    sortablle: true
  }
];

export const CardTableMockData: CardTableData = [
  [
    {
      data: {
        component: TestAvatarUsernameComponent,
        attributes: {
          imageSource:
            'https://pixel.nymag.com/imgs/daily/vulture/2017/03/23/23-han-solo.w330.h330.jpg'
        },
        content: [
          'Dylan Herrera',
          {
            component: ChipComponent,
            attributes: {
              type: 'success'
            },
            content: 'Whoa!'
          },
          'Product designer'
        ],
        handlers: {
          clicked: event => {
            console.log('Avatar clicked');
          }
        }
      }
    },
    {
      data: 'UK Product Team Salary Change'
    },
    {
      data: ['Elsie Hunter', '11/03/2019']
    },
    {
      data: ['Madge Scott', '(You)']
    },
    {
      data: {
        component: ButtonComponent,
        attributes: {
          type: 'secondary'
        },
        content: 'Approve',
        handlers: {
          clicked: event => {
            console.log('Button clicked');
          }
        }
      }
    }
  ],
  [
    {
      data: ['Joel Sanders', 'Business developer']
    },
    {
      data: 'Personal Information Update'
    },
    {
      data: ['Fakhri Shokoohi', '05/05/2019']
    },
    {
      data: ['Emelda Scandroot', 'CFO']
    },
    {
      data: {
        component: ChipComponent,
        attributes: {
          type: 'attention'
        },
        content: 'Pending'
      }
    }
  ],
  [
    {
      data: ['Nora Herrera', 'Front-end engineer']
    },
    {
      data: 'NYC Employee Promotion'
    },
    {
      data: ['Elsie Hunter', '11/03/2019']
    },
    {
      data: ['Constanza Mariano', 'HR admin']
    },
    {
      data: {
        component: ChipComponent,
        attributes: {
          type: 'attention'
        },
        content: 'Pending'
      }
    }
  ],
  [
    {
      data: ['Jaspreet Bhamrai', 'Product designer']
    },
    {
      data: 'UK Design Team Salary Change'
    },
    {
      data: ['Elsie Hunter', '11/03/2019']
    },
    {
      data:
        'Single line of some very long text that should truncate after two lines with an ellipsis.'
    },
    {
      data: {
        component: ChipComponent,
        attributes: {
          type: 'success'
        },
        content: 'Approved'
      }
    }
  ],
  [
    {
      data: ['Chioke Okonkwo', 'Business developer']
    },
    {
      data: 'Personal Information Update'
    },
    {
      data: ['Elsie Hunter', '11/03/2019']
    },
    {
      data: '\u2014'
    },
    {
      data: {
        component: ChipComponent,
        attributes: {
          type: 'success'
        },
        content: 'Approved'
      }
    }
  ],
  [
    {
      data: ['Abhoy Latif', 'Business developer']
    },
    {
      data: 'Personal Information Update'
    },
    {
      data: ['Gopichand Sana', '7/12/2018']
    },
    {
      data: ['Madge Scott', 'VP Product']
    },
    {
      data: {
        component: ChipComponent,
        attributes: {
          type: 'warning'
        },
        content: 'Rejected'
      }
    }
  ]
];
