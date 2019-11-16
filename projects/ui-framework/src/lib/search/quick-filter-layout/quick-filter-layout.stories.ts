import { storiesOf } from '@storybook/angular';
import { boolean, object, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuickFilterLayoutModule } from './quick-filter-layout.module';
import { MultiSelectModule } from '../../form-elements/lists/multi-select/multi-select.module';
import { SingleSelectModule } from '../../form-elements/lists/single-select/single-select.module';
import { DateRangePickerModule } from '../../form-elements/date-range-picker/date-range-picker.module';
import { AvatarComponent } from '../../avatar/avatar/avatar.component';
import { AvatarModule } from '../../avatar/avatar/avatar.module';
import {
  mockThings,
  mockAnimals,
  mockNames,
  mockHobbies,
} from '../../mock.const';
import { simpleUID } from '../../services/utils/functional-utils';
import { ButtonsModule } from '../../buttons/buttons.module';
import { QuickFilterConfig } from '../quick-filter/quick-filter.interface';
import { InputModule } from '../../form-elements/input/input.module';
import { SocialModule } from '../../form-elements/social/social.module';
import { TimePickerModule } from '../../form-elements/timepicker/timepicker.module';
import { InputTypes } from '../../form-elements/input/input.enum';
import { SplitInputSingleSelectModule } from '../../form-elements/split-input-single-select/split-input-single-select.module';

const story = storiesOf(ComponentGroupType.Search, module).addDecorator(
  withKnobs
);

const template1 = `
<b-quick-filter-layout
            [showResetFilter]="showResetFilter"
            (filtersChange)="filtersChange($event)"
            (resetFilters)="resetFilters()">

    <b-text-button bar-prefix
               text="Left"
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
               text="Right"
               color="primary">
    </b-text-button>

</b-quick-filter-layout>
`;

const template2 = `
<b-quick-filter-layout
            [quickFilters]="quickFilters"
            [showResetFilter]="showResetFilter"
            (filtersChange)="filtersChange($event)">

    <b-input *ngIf="showName" [id]="'name'">
    </b-input>

    <b-split-input-single-select *ngIf="showSplitInpSel"
            [id]="'split'">
    </b-split-input-single-select>

    <b-multi-select *ngIf="showHobbies"
            [id]="'hobbies'">
    </b-multi-select>

    <b-social *ngIf="showSocial" [id]="'social'">
    </b-social>

    <b-timepicker *ngIf="showTime"
              [id]="'time'">
    </b-timepicker>

</b-quick-filter-layout>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Quick Filter Layout'" style="background-color: rgb(247,247,247);">
  <div style="max-width: calc(100vw - 100px);">
    ${template1}
    <br><br>
    ${template2}
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
  ${template1}
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

const quickFilters: QuickFilterConfig[] = [
  {
    key: 'name',
    label: 'Your name',
    placeholder: 'Enter your name',
    value: mockNames(1),
  },
  {
    key: 'social',
    label: 'Your social account',
  },
  {
    key: 'time',
    label: 'Time to get ill',
  },
  {
    key: 'split',
    label: 'Pick items',
    inputType: InputTypes.number,
    selectOptions: animals,
    value: { inputValue: 23, selectValue: undefined },
  },
  {
    key: 'hobbies',
    label: 'Your hobbies',
    placeholder: 'Pick from the list',
    options: optionsFromList(mockHobbies(), 'All hobbies'),
    showSingleGroupHeader: false,
  },
];

story.add(
  'Quick Filter Layout',
  () => {
    return {
      template: storyTemplate,
      props: {
        showResetFilter: boolean('showResetFilter', false, 'props'),
        quickFilters: object('quickFilters', quickFilters, 'props'),
        BSSoptions: object('BSSoptions', items, 'ignore'),
        BMSoptions: object('BMSoptions', animals, 'ignore'),
        filtersChange: action('Quick filter bar change'),
        resetFilters: action('Reset Filters click'),

        showName: boolean('showName', true, 'props'),
        showHobbies: boolean('showHobbies', true, 'props'),
        showSocial: boolean('showSocial', true, 'props'),
        showTime: boolean('showTime', false, 'props'),
        showSplitInpSel: boolean('showSplitInpSel', false, 'props'),
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
          InputModule,
          SocialModule,
          TimePickerModule,
          SplitInputSingleSelectModule,
        ],
        entryComponents: [AvatarComponent],
      },
    };
  },
  { notes: { markdown: note } }
);
