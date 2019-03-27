import { CardTableData } from './card-table.interface';

export const cardTableMockData: CardTableData = {
  meta: [
    {
      id: 1,
      name: 'Requested For',
      width: 'auto',
      sortablle: false
    },
    {
      id: 2,
      name: 'Subject',
      width: 'auto',
      sortablle: false
    },
    {
      id: 3,
      name: 'Requested by',
      width: 'auto',
      sortablle: false
    },
    {
      id: 4,
      name: 'Assignee',
      width: 'auto',
      sortablle: false
    },
    {
      id: 5,
      name: 'Status',
      width: 'auto',
      sortablle: true
    }
  ],
  rows: [
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
        data: 'Pending'
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
        data: 'Pending'
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
        data: '-'
      },
      {
        data: 'Approved'
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
        data: '-'
      },
      {
        data: 'Approved'
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
        data: 'Rejected'
      }
    ]
  ]
};
