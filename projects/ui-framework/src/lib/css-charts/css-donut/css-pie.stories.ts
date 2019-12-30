import {storiesOf} from '@storybook/angular';
import {withKnobs, object, number, boolean} from '@storybook/addon-knobs/angular';
import {ComponentGroupType} from '../../consts';
import {StoryBookLayoutModule} from '../../story-book-layout/story-book-layout.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CssChartsModule} from '../css-charts.module';

const story = storiesOf(`${ComponentGroupType.Charts}.CSS-charts`, module).addDecorator(
  withKnobs
);

const template = `
  <b-css-pie
  [donut]="donut"
  [initialValues]="initialValues"
  [size]="size"
  [showText]="showText"
  [border]="border"
  [colors]="colors"
  [cellSpacing]="cellSpacing"
  [animate]="animate"
  ></b-css-pie>
`;
// tslint:disable:max-line-length
const note = `
  ## Snow

  #### Module
  * CssChartsModule *

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  colors | string[] | colors array for donut chart | ['#6495ED', 'gray', '#cd5c5c', 'thistle', 'lightgray']
  size | number | defines the diameter of the pie chart | 160
  border | number | defines the border width of the pie chart | 25;
  showText | boolean | shows percentage of each section if is true and bigger than 5 percent and border >= 25 and size >= 70 | true;
  initialValues | number[] | total sum of values should be 100 for full pie chart. | []
  cellSpacing | number | value between 0 to 10, defines the spacing piece in between cells | 2;

  ~~~
  ${ template }
  ~~~

`;
// tslint:enable:max-line-length
const storyTemplate = `
<b-story-book-layout [title]="'Css Donut Chart'">
    ${ template }
</b-story-book-layout>
`;

const toAdd = () => ({
  template: storyTemplate,
  props: {
    donut: boolean('donut', true),
    showText: boolean('showText', true),
    animate: boolean('animate', false),
    initialValues: object('values', [1, 2, 3, 6]),
    size: number('size', 46),
    border: number('border', 6),
    colors: object('color', [
      'goldenrod',
      'green',
      'red',
      'blue',
      'blueviolet'
    ]),
    cellSpacing: number('cellSpacing', 2)
  },
  moduleMetadata: {
    imports: [StoryBookLayoutModule, BrowserAnimationsModule, CssChartsModule]
  }
});

story.add('Simple Pie Chart', toAdd, { notes: { markdown: note } });
