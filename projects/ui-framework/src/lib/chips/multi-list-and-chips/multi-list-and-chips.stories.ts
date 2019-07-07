import { storiesOf } from '@storybook/angular';
import { object, withKnobs, text } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MultiListAndChipsOptionsMock } from './multi-list-and-chips.mock';
import { MultiListAndChipsModule } from './multi-list-and-chips.module';
import { action } from '@storybook/addon-actions';

const story = storiesOf(ComponentGroupType.Chips, module).addDecorator(
  withKnobs
);

const story2 = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const options = MultiListAndChipsOptionsMock;

const template = `
  <b-multi-list-and-chips
        [options]="options"
        [listLabel]="listLabel"
        [chipsLabel]="chipsLabel"
        (selectChange)="onSelectChange($event)">
  </b-multi-list-and-chips>
`;

const note = `
  ## Multi List And Chips

  #### Module
  *MultiListAndChipsModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  options | SelectGroupOption[] | model of selection group | none
  listLabel | string | label text for the Multi List component | none
  chipsLabel | string | label text for the Chips List component | none
  selectChange | &lt;ListChange&gt; | returns ListChange | none

  ~~~
  ${template}
  ~~~

  #### Example of SelectGroupOption[]
\`\`\`
  [
    {
      "groupName": "For kids",
      "options": [
        {
          "value": "Lego Building/Assembling",
          "id": "85d78",
          "selected": false
        },
        ....
      ]
    },
    .....
  ]
\`\`\`

`;

const storyTemplate = `
<b-story-book-layout [title]="'Multi List And Chips'">
  <div style="padding: 30px;margin:auto;max-width:900px;background: rgb(245,245,245);">
    ${template}
  </div>
</b-story-book-layout>
`;

const toAdd = () => ({
  template: storyTemplate,
  props: {
    listLabel: text('chipsLabel', 'Select fields:'),
    chipsLabel: text('listLabel', 'Selected fields:'),
    onSelectChange: action('ListChange'),
    options: object('options', options)
  },
  moduleMetadata: {
    imports: [
      MultiListAndChipsModule,
      StoryBookLayoutModule,
      BrowserAnimationsModule
    ]
  }
});

story.add('Multi List And Chips', toAdd, { notes: { markdown: note } });

story2.add('Multi List And Chips', toAdd, { notes: { markdown: note } });
