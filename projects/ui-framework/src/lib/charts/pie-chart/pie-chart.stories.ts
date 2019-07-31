import {storiesOf} from '@storybook/angular';
import {boolean, number, object, text, withKnobs} from '@storybook/addon-knobs/angular';
import {ComponentGroupType} from '../../consts';
import {ChartsModule} from '../charts.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {StoryBookLayoutModule} from '../../story-book-layout/story-book-layout.module';
import {mockAvatar} from '../../mock.const';
import {TypographyModule} from '../../typography/typography.module';

const story = storiesOf(ComponentGroupType.Charts, module).addDecorator(
  withKnobs
);

const avatarMock = mockAvatar();

const template = `
<div>
  <small>Demo of all binding options</small>
  <b-pie-chart
    [height]="height"
    [data]="data"
    [name]="name"
    [donut]="donut"
    [donutWidth]="donutWidth"
    [showDataLabels]="showDataLabels"
    [legend]="legend"
    [donutInnerSize]="donutInnerSize"
    [title]="title"
    [pointFormat]="pointFormat"
  >
  </b-pie-chart>
</div>
<div>
  <small>Only for donut, not supporting legend and dataLabels</small>
  <div style="position:relative;">
    <b-pie-chart
      [height]="height"
      [data]="data"
      [name]="name"
      [donut]="true"
      [donutWidth]="donutWidth"
      [showDataLabels]="false"
      [legend]="false"
    >
    </b-pie-chart>
    <span style="position: absolute; display:block;
    text-align:center;
    left: 50%; width: 100px; margin-left: -50px; top:50%;
    height: 50px; margin-top: -25px;"><b-display-4 style="line-height: 50px;">365K</b-display-4></span>
  </div>
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
        height: number('height', 400),
        donutInnerSize: number('donutInnerSize', 60),
        donutWidth: number('donutWidth', null),
        data: object('data', [['bananas', 2], ['apples', 7]])
      },
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          ChartsModule,
          TypographyModule
        ]
      }
    };
  },
  {notes: {markdown: note}}
);
