import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, withKnobs, number, boolean} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { DatepickerModule } from './datepicker.module';
import {ComponentGroupType} from '../../consts';

  const datepickerStories = storiesOf(ComponentGroupType.FormElements, module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);
const template = `
  <b-datepicker
  (dateChange)="dateChange($event)" [inputPlaceholder]="inputPlaceholder">
  </b-datepicker>
`;
const note = `
  ## Slider Element

  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  inputPlaceholder | string | Input placeholder | mandatory |
  dateChange | EventEmitter | Date change callback |

  ~~~
  ${template}
  ~~~
`;

datepickerStories.add(
  'Datepicker',
  () => {
    return {
      template,
      props: {
        inputPlaceholder: text('inputPlaceholder', 'Choose a date'),
        dateChange: action(),
      },
      moduleMetadata: {
        imports: [DatepickerModule]
      }
    };
  },
  { notes: { markdown: note }  }
);
