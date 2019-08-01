import {storiesOf} from '@storybook/angular';
import {boolean, number, object, text, withKnobs} from '@storybook/addon-knobs/angular';
import {ComponentGroupType} from '../../consts';
import {ChartsModule} from '../charts.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StoryBookLayoutModule} from '../../story-book-layout/story-book-layout.module';

const story = storiesOf(ComponentGroupType.Charts, module).addDecorator(
  withKnobs
);
const template = `
<div>
  <small>Demo of all binding options</small>
  <b-pie-chart
    [data]="data"
    [donut]="donut"
    [showDataLabels]="showDataLabels"
    [legend]="legend"
    [colorPalette]="colorPalette"
    [height]="height"
    [name]="name"
    [donutWidth]="donutWidth"
    [donutInnerSize]="donutInnerSize"
    [title]="title"
    [pointFormat]="pointFormat"
  >
  </b-pie-chart>
</div>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Pie Chart'">
    ${template}
</b-story-book-layout>
`;

const note = `
  ## Single Chart

  #### Module
  *ChartModule*

  ~~~
  ${template}
  ~~~

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  // type | CardType | Card theme | primary (optional)
  // card | CardData | card contents data | none
  // clickable | boolean | is the card clickable? | false
  // clicked | Function | handler of Card Clicked event | none
  //
  // #### card: CardData - single card data properties
  // Name | Type | Description | Default value
  // --- | --- | --- | ---
  // data | CardDataType | card data | none
  // menu | MenuItem[] | array of menu items | none (optional)
`;

story.add(
  'Pie Chart',
  () => {
    return {
      template: storyTemplate,
      props: {
        showDataLabels: boolean('showDataLabels', false),
        donut: boolean('donut', true),
        legend: boolean('legend', true),
        name: text('name', 'fruits'),
        pointFormat: text('pointFormat', '{point.percentage:.1f}% of {series.name}'),
        title: text('title', null),
        height: number('height', 200),
        donutInnerSize: number('donutInnerSize', 60),
        donutWidth: number('donutWidth', null),
        data: object('data', [['bananas', 15], ['apples', 24], ['avocado', 12], ['mango', 77]]),
        colorPalette: object('colorPalette', [
          '#CC2E4E',
          '#87233D',
          '#DB8962',
          '#FEA54A',
          '#FECC4A',
          '#8F4A67',
          '#D2728A',
          '#D295A4',
          '#E0ACAC',
          '#BF8A78',
          '#C0755A',
          '#866161',
          '#663E4E',
          '#574285',
          '#6969C6',
          '#556E8A',
          '#789BC2',
          '#9BC7FA',
          '#6DC3BC',
          '#82D9B1',
          '#959595',
          '#616161',
          '#313131',
        ])
      },
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          ChartsModule
        ]
      }
    };
  },
  {notes: {markdown: note}}
);
