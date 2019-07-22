import { storiesOf } from '@storybook/angular';
import {
  withKnobs,
  text,
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../../consts';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { ChainSelectModule } from './chain-select.module';
import { ComponentRendererModule } from '../../../services/component-renderer/component-renderer.module';
import { IconsModule } from '../../../icons/icons.module';
import { SingleSelectModule } from '../single-select/single-select.module';
import { SingleSelectComponent } from '../single-select/single-select.component';

const buttonStories = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-chain-select [selectComponent]="selectComponent"
                [actionLabel]="actionLabel"
                [selectedKey]="selectedKey"
                [outputKey]="outputKey"
                [selected]="selected"
                (selectChange)="selectChange($event)">
</b-chain-select>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Single list'">
  <div style="flex:1; max-width: 350px;">
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
  selectComponent | Type | Select component to chain | none
  actionLabel | string | action label text | none
  outputKey | string | key of event emitter in selectComponent | none
  selectChange | action | returns object with listChange and index each time a select in the chain is changed | none
  selected | (string[] or number[])[] | selected values for each selectComponent | none (Optional)
  selectedKey | string | key of selected values input in selectComponent | none (Optional)

  ~~~
  ${template}
  ~~~
`;

buttonStories.add(
  'Chain Select',
  () => ({
    template: storyTemplate,
    props: {
      selectChange: action('Chain select change'),
      selectComponent: SingleSelectComponent,
      actionLabel: text('actionLabel', 'Add another'),
    },
    moduleMetadata: {
      imports: [
        IconsModule,
        ComponentRendererModule,
        SingleSelectModule,
        StoryBookLayoutModule,
        ChainSelectModule,
      ],
      entryComponents: [SingleSelectComponent]
    }
  }),
  { notes: { markdown: note } }
);
