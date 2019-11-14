import { storiesOf } from '@storybook/angular';
import { boolean, object, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { cloneDeep } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuickFilterLayoutModule } from './quick-filter-layout.module';
import { MultiSelectModule } from '../../form-elements/lists/multi-select/multi-select.module';
import { SingleSelectModule } from '../../form-elements/lists/single-select/single-select.module';
import { DateRangePickerModule } from '../../form-elements/date-range-picker/date-range-picker.module';
import { optionsMock as BSSoptionsMock } from '../../form-elements/lists/single-list/single-list.mock';
import { optionsMock as BMSoptionsMock } from '../../form-elements/lists/multi-list/multi-list.mock';
import { AvatarComponent } from '../../avatar/avatar/avatar.component';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import {
  randomItems,
  mockHobbiesList,
  randomAnimals,
  mockThings,
  mockAnimals,
} from '../../mock.const';
import { simpleUID } from '../../services/utils/functional-utils';
import { ButtonsModule } from '../../buttons/buttons.module';

const story = storiesOf(ComponentGroupType.Search, module).addDecorator(
  withKnobs
);

const template = `
<b-quick-filter-layout
            [showResetFilter]="showResetFilter"
            (filtersChange)="filtersChange($event)"
            (resetFilters)="resetFilters()">

    <b-text-button bar-prefix
               text="Less"
               color="primary">
    </b-text-button>

    <b-single-select
            [id]="'select-1'"
            [label]="'Select here'"
            [placeholder]="'Some stuff'"
            [options]="BSSoptions">
    </b-single-select>

    <b-multi-select
            [id]="'select-2'"
            [label]="'Then select here'"
            [placeholder]="'More stuff'"
            [options]="BMSoptions">
    </b-multi-select>

    <b-date-range-picker
            [id]="'picker-1'"
            [label]="'Pick date range'"
            [startDateLabel]="'From'"
            [endDateLabel]="'To'"
            [type]="'date'">
    </b-date-range-picker>

    <b-text-button bar-suffix
               text="More"
               color="primary">
    </b-text-button>

</b-quick-filter-layout>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Quick Filter Layout'" style="background-color: rgb(247,247,247);">
  <div style="max-width: calc(100vw - 100px);">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Quick filters
  #### Module
  *QuickFilterModule*

  #### Properties
  Name | Type | Description | Default Value
  --- | --- | --- | ---
  [quickFilters] | QuickFilterConfig[] | array of quick filters | none
  [showResetFilter] | boolean | displays reset button | false
  (filtersChange) | EventEmitter&lt;QuickFilterChangeEvent&gt; | emits on quick filter bar change | none
  (resetFilters) | EventEmitter&lt;void&gt; |emits on reset click | none

  ~~~
  ${template}
  ~~~
`;

const optionsFromList = (list, key = 'Stuff') => [
  {
    groupName: key,
    options: list.map(c => ({ value: c, id: simpleUID() })),
  },
];

const deselectOptions = options =>
  options.map(g => ({
    ...g,
    options: g.options.map(o => ({ ...o, selected: false })),
  }));

const items = optionsFromList(mockThings(), 'Things');

const animals = optionsFromList(mockAnimals(), 'Animals');

story.add(
  'Quick Filter Layout',
  () => {
    return {
      template: storyTemplate,
      props: {
        showResetFilter: boolean('showResetFilter', true),

        BSSoptions: object('BSSoptions', items),
        BMSoptions: object('BMSoptions', animals),

        filtersChange: action('Quick filter bar change'),
        resetFilters: action('Reset Filters click'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          QuickFilterLayoutModule,
          MultiSelectModule,
          SingleSelectModule,
          DateRangePickerModule,
          AvatarModule,
          ButtonsModule,
        ],
        entryComponents: [AvatarComponent],
      },
    };
  },
  { notes: { markdown: note } }
);
