import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ButtonModule } from './button.module';
import { ButtonType, ButtonSize } from './button.component';
import { values } from 'lodash';

const buttonStories = storiesOf('Buttons & Indicators', module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const typeOptions = values(ButtonType);
const sizeOptions = values(ButtonSize);
const template = `
  <b-button
    (clicked)="onClick($event)"
    [type]="type"
    [size]="size">
      {{label}}
  </b-button>
`;
const note = `
  ## Button Element

  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  type | ButtonType | enum for setting the button type | primary (optional)
  size | ButtonSize | enum for setting the button size | medium (optional)
  clicked | Function | callback for clicking on the button |

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
buttonStories.add(
    'Regular Button', () => ({
      template,
      props: {
        onClick: action(),
        label: text('label', 'Click me'),
        type: select('type', typeOptions, ButtonType.primary),
        size: select('size', sizeOptions, ButtonSize.medium),
      },
      moduleMetadata: {
        imports: [ButtonModule]
      }
    }),
    { notes: { markdown: note }  }
  );

