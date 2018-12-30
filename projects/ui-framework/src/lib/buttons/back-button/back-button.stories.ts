import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { ButtonSize, ButtonType } from '../buttons.enum';
import { values } from 'lodash';
import { action } from '@storybook/addon-actions';
import { ButtonsModule } from '../buttons.module';
import { Icons, IconSize, IconColor } from '../../icons/icons.enum';
import { IconsModule } from '../../icons/icons.module';

const backButtonStories = storiesOf('Buttons & Indicators', module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const typeOptions = values(ButtonType);
const IconColors = values(IconColor);
const template = `
  <b-back-button
    (clicked)="onClick($event)"
    [type]="type">
    <b-icon icon="${Icons.back_arrow_link}" size="${IconSize.mini}" [color]="iconColor"></b-icon>
      {{label}}
  </b-back-button>
`;

const note = `
  ## Back Button Element

  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  type | ButtonType | enum for setting the button type | primary (optional)
  size | ButtonSize | enum for setting the button size | medium (optional)
  clicked | Function | callback for clicking on the back button |

  #### Style customization

  property name | Description
  --- | ---
  primary-color | the color of the primary button
  primary-color-dark | the hover color of the primary button
  primary-color-darker | the pressed color of the primary button

  ~~~
  ${template}
  ~~~
`;

backButtonStories.add(
  'Back Button', () => ({
    template,
    props: {
      onClick: action(),
      label: text('label', 'Back'),
      type: select('type', typeOptions, ButtonType.secondary),
      iconColor: select('color', IconColors, IconColor.dark),
    },
    moduleMetadata: {
      imports: [ButtonsModule, IconsModule]
    },
  }),
  { notes: { markdown: note }  }
);
