import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { boolean, number, object, select, text, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../story-book-layout/story-book-layout.module';

import { AvatarModule } from '../buttons-indicators/avatar/avatar.module';
import { RangeDatepickerModule } from './range-datepicker.module';



const tableStories = storiesOf(ComponentGroupType.DateRangePicker, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
<b-range-datepicker
(selectDate)="onSelectDate($event)"
[date]="date">
</b-range-datepicker>
`;

const storyTemplate = `
<b-story-book-layout title="Range Datepicker">
  ${template}
</b-story-book-layout>
`;

const note = `
  ## Auto complete Element

  #### Properties
  Name | Type | Description
  --- | --- | ---
  @Input(date) | DateRange | Init the rangepicker
  @Output(dateSelected) | DateRange | Emitting the current range picker value

  ~~~
  ${template}
  ~~~
`;
tableStories.add(
  'Date Range Picker',
  () => {
    return {
      template: storyTemplate,
      props: {

      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          RangeDatepickerModule
        ],
      }
    };
  },
  { notes: { markdown: note } }
);
