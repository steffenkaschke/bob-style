import { storiesOf, addDecorator } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { WelcomeComponent } from './welcome.component';


storiesOf('Hi', module)
  .addDecorator(withNotes)
  .add(
    'Regular',
    () => ({
      component: WelcomeComponent,
      props: {
      },
    }),
    { notes: 'My notes on some button' }
  );

