import { storiesOf, moduleMetadata } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ButtonModule } from './button.module';

const buttonStories = storiesOf('Buttons & Indicators', module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
  <b-button (onClick)="onClick()">
    {{label}}
  </b-button>
`;
const note = `
  ## Button Element
  #####

  Name | Type | Description | Default value
  --- | --- | --- | ---

  ~~~
  ${template}
  ~~~
`;
buttonStories.add(
    'Regular Button', () => ({
      template,
      props: {
        onClick: action(),
        label: text('label', 'Click me')
      },
      moduleMetadata: {
        imports: [ButtonModule]
      }
    }),
    { notes: { markdown: note }  }
  );

