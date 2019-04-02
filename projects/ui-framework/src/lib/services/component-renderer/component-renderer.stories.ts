import { storiesOf } from '@storybook/angular';
import {
  array,
  boolean,
  number,
  object,
  select,
  text,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';

import { ComponentRendererModule } from './component-renderer.module';
import { ButtonComponent } from '../../buttons-indicators/buttons/button/button.component';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { AvatarComponent } from '../../buttons-indicators/avatar/avatar.component';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';

const story = storiesOf(ComponentGroupType.Services, module).addDecorator(
  withKnobs
);

const template = `
<b-component-renderer [component]="componentData">
</b-component-renderer>
`;

const storyTemplate = `
<b-story-book-layout title="Component Renderer">
  <div style="padding: 50px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const componentData = {
  component: ButtonComponent,
  attributes: {
    type: 'secondary'
  },
  content: [
    {
      component: AvatarComponent,
      content: 'Super button!',
      attributes: {
        imageSource: 'http://i.pravatar.cc/200',
        size: 'mini',
        isClickable: true
      },
      handlers: {
        clicked: () => {
          console.log('Avatar was clicked!');
        }
      }
    },
    'Super button'
  ],
  handlers: {
    clicked: () => {
      console.log('Button was clicked!');
    }
  }
};

const note = `
  ## Component Renderer

  #### Module
  *ComponentRendererModule*

  #### [component]
  properties of object describing Component to be rendered
  Name | Type | Description | Default value
    --- | --- | --- | ---
  component | Component | component reference | none
  attributes | object | object with component inputs | none (optional)
  content | string | text to be passed as ng-content of the component | none (optional)

  ~~~
  ${template}
  ~~~
`;

story.add(
  'Component Renderer',
  () => {
    return {
      template: storyTemplate,
      props: {
        componentData: object('component', componentData)
      },
      moduleMetadata: {
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          ComponentRendererModule,
          ButtonsModule,
          AvatarModule
        ],
        entryComponents: [ButtonComponent, AvatarComponent]
      }
    };
  },
  { notes: { markdown: note } }
);
