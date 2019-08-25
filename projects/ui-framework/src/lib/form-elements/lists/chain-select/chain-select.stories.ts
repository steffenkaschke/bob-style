import { storiesOf } from '@storybook/angular';
import { withKnobs, text } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../../consts';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { SingleSelectComponent } from '../single-select/single-select.component';
import { ChainSelectExampleModule, template as exampleTemplate } from './chain-select.example';

const buttonStories = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-chain-select-example
  [actionLabel]="actionLabel"
  (selectChange)="selectChange($event)">
</b-chain-select-example>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Chain select'">
  <div style="max-width: 350px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Chain select

  #### Module
  *ChainSelectModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  actionLabel | string | action label text | none
  selectChange | action | EventEmitter - emits ChainSelectEvent | none
  selectedItemList | (any)[] | selected values for each select | none (Optional)

  ~~~
  ${exampleTemplate}
  ~~~
`;

buttonStories.add(
  'Chain select',
  () => ({
    template: storyTemplate,
    props: {
      selectChange: action('Chain select event'),
      actionLabel: text('action label', 'Add another'),
    },
    moduleMetadata: {
      imports: [StoryBookLayoutModule, ChainSelectExampleModule],
      entryComponents: [SingleSelectComponent]
    }
  }),
  { notes: { markdown: note } }
);
