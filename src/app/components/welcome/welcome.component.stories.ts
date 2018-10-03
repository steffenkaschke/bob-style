import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { WelcomeComponent } from './welcome.component';


storiesOf('Hi', module)
  .add('Regular', withNotes(`
      <h1>Test</h1> some info here
    `)(() => ({
        component: WelcomeComponent,
        props: {}
      }))
  );

