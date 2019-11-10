import { storiesOf } from '@storybook/angular';
import { withKnobs, object, boolean } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../../consts';
import { ButtonsModule } from '../../../buttons/buttons.module';
import { TypographyModule } from '../../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { SingleListModule } from './single-list.module';
import { SelectGroupOption } from '../list.interface';
import { AvatarComponent } from '../../../avatar/avatar/avatar.component';
import { AvatarModule } from '../../../avatar/avatar/avatar.module';
import { optionsMock } from './single-list.mock';
import { cloneDeep } from 'lodash';

const buttonStories = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-single-list [options]="options"
               (selectChange)="selectChange($event)"
               [showSingleGroupHeader]="showSingleGroupHeader">
                <b-text-button footer
                  [text]="'Click Me!'"
                  [color]="'primary'">
                </b-text-button>
</b-single-list>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Single list'">
  <div style="max-width: 350px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Single list

  #### Module
  *SingleListModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [options] | SelectGroupOption[] | model of selection group | none
  [showSingleGroupHeader] | boolean | displays single group with group header | false
  [maxHeight] | number | component max height | 352 (8 rows)
  (selectChange) | EventEmitter&lt;ListChange&gt; | emits ListChange | none

  ~~~
  ${template}
  ~~~
`;

const options = cloneDeep(optionsMock);

// options[0].options[1].selected = true;
// options[0].options[3].disabled = true;

buttonStories.add(
  'Single list',
  () => ({
    template: storyTemplate,
    props: {
      selectChange: action('Single list change'),
      showSingleGroupHeader: boolean('showSingleGroupHeader', true),
      options: object<SelectGroupOption>('options', options),
    },
    moduleMetadata: {
      imports: [
        SingleListModule,
        ButtonsModule,
        TypographyModule,
        BrowserAnimationsModule,
        StoryBookLayoutModule,
        AvatarModule,
      ],
      entryComponents: [AvatarComponent],
    },
  }),
  { notes: { markdown: note } }
);
