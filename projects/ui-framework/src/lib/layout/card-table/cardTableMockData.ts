import { CardTableMetaData, CardTableData } from './card-table.interface';
import { ChipComponent } from '../../buttons-indicators/chips/chip/chip.component';

export const CardTableMockMetaData: CardTableMetaData = [
  {
    id: 1,
    name: 'Requested For',
    sortablle: false,
    // width: 400
  },
  {
    id: 2,
    name: 'Subject',
    width: 20,
    textStyle: {
      fontWeight: '500'
      // crazyStuff: 'not-allowed'
    },
    sortablle: false
  },
  {
    id: 3,
    name: 'Requested by',
    sortablle: false,
    // width: 20,
  },
  {
    id: 4,
    name: 'Assignee',
    sortablle: false,
    width: 30,
  },
  {
    id: 5,
    name: 'Status',
    sortablle: true,
    align: 'right',
    // width: 70,
  }
];

export const CardTableMockData: CardTableData = [
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
