import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, withKnobs } from '@storybook/addon-knobs/angular';
import { SliderModule } from './slider.module';

const sliderStories = storiesOf('Buttons & Indicators', module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);


