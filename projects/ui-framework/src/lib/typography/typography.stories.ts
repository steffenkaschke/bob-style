import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, withKnobs } from '@storybook/addon-knobs/angular';
import { TypographyModule } from './typography.module';

const typographyStories = storiesOf('Typography', module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const displayTemplate = `
  <b-display-1>{{label}}</b-display-1>
`;
const note = `
  ## Basic Typography Elements
  #####

  Name | Type | Description | Default value
  --- | --- | --- | ---

  ~~~
  ${displayTemplate}
  ~~~
`;
typographyStories.add(
    'Display Text', () => ({
      template: displayTemplate,
      props: {
        label: text('label', 'This is Display text')
      },
      moduleMetadata: {
        imports: [TypographyModule]
      }
    }),
    { notes: { markdown: note }  }
  );

