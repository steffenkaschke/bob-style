import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { InputModule } from './input.module';

const avatarStories = storiesOf('Input', module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const template = `
  <b-input>
  </b-input>
`;
const note = `
  ## Input Element

  #### Properties

  Name | Type | Description | Default value
  --- | --- | --- | ---
  type | InputType | type of input |

  ~~~
  ${ template }
  ~~~
`;
avatarStories.add(
  'Input',
  () => {
    return {
      template,
      props: {},
      moduleMetadata: {
        imports: [InputModule]
      }
    };
  },
  { notes: { markdown: note } }
);
