import { storiesOf } from '@storybook/angular';
import { text, select, boolean, withKnobs, number, object } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { SimpleBarChartModule } from './simple-bar-chart.module';
import { simpleBarChartMockData, simpleBarChartMockData2 } from './simple-bar-chart.mock';

const story = storiesOf(ComponentGroupType.Indicators, module).addDecorator(withKnobs);

const story2 = storiesOf(ComponentGroupType.Charts, module).addDecorator(withKnobs);

const template = `
  <b-simple-bar-chart [data]="data"
                      [config]="{
                        disableAnimation: disableAnimation
                      }">
  </b-simple-bar-chart>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Simple Bar Chart'">
  <div style="max-width: none;">
    ${template}

    <div style="margin-top: 100vh; padding-bottom: 100px;">
    <h3 style="text-align: left; margin-bottom: 50px;">Bar chart animates as it comes into view</h3>
        <b-simple-bar-chart [data]="data2"
                      [config]="{
                        disableAnimation: disableAnimation
                      }">
        </b-simple-bar-chart>
    </div>
  </div>
</b-story-book-layout>
`;

const note = `
  ## Simple Bar Chart
  #### Module
  *SimpleBarChartModule*

  *Note*: Bar chart animates when it appears in viewport. <br>
  To disable this behaviour (and all animation in general), \
  pass \`\`\`{ disableAnimation: true }\`\`\` as [config].

  #### Properties
  Name | Type | Description
  --- | --- | ---
  [data] | SimpleBarChartItem[] | array of items data
  [config] | ProgressBarConfig | \`\`\`disableAnimation: boolean\`\`\` - disables animation

  ~~~
  ${template}
  ~~~

  #### Example \`data\`
  ~~~
data = [
    {
      value: 73,
      count: 7,
      color: '#926296',
      text: 'Strongly disagree'
    },
]
  ~~~
`;

const toAdd = () => ({
  template: storyTemplate,
  props: {
    data2: simpleBarChartMockData2,
    data: object('data', simpleBarChartMockData),
    disableAnimation: boolean('disableAnimation', false)
  },
  moduleMetadata: {
    imports: [StoryBookLayoutModule, SimpleBarChartModule]
  }
});

story.add('Simple Bar Chart', toAdd, { notes: { markdown: note } });
story2.add('Simple Bar Chart', toAdd, { notes: { markdown: note } });