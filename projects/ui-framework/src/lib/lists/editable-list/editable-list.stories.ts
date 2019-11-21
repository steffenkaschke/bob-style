import { storiesOf } from '@storybook/angular';
import {
  text,
  object,
  withKnobs,
  boolean,
} from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { cloneDeep } from 'lodash';
import { EditableListModule } from './editable-list.module';
import { editableListMock } from './editable-list.mock';
import { action } from '@storybook/addon-actions';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const componentTemplate1 = `
<b-editable-list [list]="list"
                 [allowedActions]="{
                   sort: allowSort,
                   edit: allowEdit,
                   add: allowAdd,
                   remove: allowRemove
                 }"
                 (changed)="onListUpdate($event)">
</b-editable-list>
`;

const template = `
<b-story-book-layout [title]="'Editable List'">
  <div>
  ${componentTemplate1}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Editable List

  #### Module
  *EditableListModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | ---
  [list] | SelectOption[] | flat list of SelectOption to edit | &nbsp;
  [allowedActions] | EditableListActions | what actions are available (sort, edit, remove)\
   | all enabled
  (changed) | SelectOption[] | emits updated list | &nbsp;


  ~~~
  ${componentTemplate1}
  ~~~


`;

const listMock = cloneDeep(editableListMock);

story.add(
  'Editable List',
  () => {
    return {
      template,
      props: {
        allowSort: boolean('allowSort', true, 'Props'),
        allowEdit: boolean('allowEdit', true, 'Props'),
        allowAdd: boolean('allowAdd', true, 'Props'),
        allowRemove: boolean('allowRemove', true, 'Props'),
        list: object('list', listMock, 'Options'),
        onListUpdate: action('onListUpdate'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          EditableListModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
