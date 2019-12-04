import { storiesOf } from '@storybook/angular';
import {
  text,
  object,
  withKnobs,
  boolean,
  select,
} from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { cloneDeep } from 'lodash';
import { EditableListModule } from './editable-list.module';
import { editableListMock } from './editable-list.mock';
import { action } from '@storybook/addon-actions';
import { EditableListService } from './editable-list.service';
import { ListSortType } from './editable-list.enum';
import { CommonModule } from '@angular/common';

const story = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const componentTemplate1 = `
<b-editable-list tabindex="0" [list]="list === 'Ascending' ?listMockAsc : list === 'Descending' ? listMockDesc : listMock"
                  [sortType]="sortType !== 0 ? sortType : undefined"
                 [allowedActions]="{
                   sort: allowSort,
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
  [allowedActions] | EditableListActions | what actions are available (sort, add, remove)\
   | all enabled
  (changed) | SelectOption[] | emits updated list | &nbsp;


  ~~~
  ${componentTemplate1}
  ~~~


`;

const listMock = cloneDeep(editableListMock);
const listMockAsc = cloneDeep(editableListMock);
const listMockDesc = cloneDeep(editableListMock);

EditableListService.prototype.sortList(listMockAsc, ListSortType.Asc);
EditableListService.prototype.sortList(listMockDesc, ListSortType.Desc);

story.add(
  'Editable List',
  () => {
    return {
      template,
      props: {
        listMock: listMock,
        listMockAsc: listMockAsc,
        listMockDesc: listMockDesc,

        list: select(
          'list',
          ['Ascending', 'Descending', 'Custom order'],
          'Custom order',
          'Props'
        ),

        sortType: select('sortType', [0, 'Asc', 'Desc'], 0, 'Props'),
        allowSort: boolean('allowSort', true, 'Props'),
        allowAdd: boolean('allowAdd', true, 'Props'),
        allowRemove: boolean('allowRemove', true, 'Props'),
        onListUpdate: action('onListUpdate'),
      },
      moduleMetadata: {
        imports: [
          CommonModule,
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          EditableListModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
