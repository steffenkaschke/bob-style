import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, withKnobs, number, boolean} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { DatepickerModule } from './datepicker.module';

  const datepickerStories = storiesOf('Buttons & Indicators', module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);
const template = `
  <b-datepicker
  (dateChange)="dateChange($event)">
  </b-datepicker>
`;
const note = `
  ## Slider Element

  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
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
        dateChange: action(),
      },
      moduleMetadata: {
        imports: [DatepickerModule]
      }
    };
  },
  { notes: { markdown: note }  }
);
