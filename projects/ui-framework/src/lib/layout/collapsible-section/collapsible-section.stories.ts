import { storiesOf } from '@storybook/angular';
import {
  boolean,
  select,
  text,
  array,
  object,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { CollapsibleSectionModule } from './collapsible-section.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { mockText } from '../../mock.const';
import { randomNumber } from '../../services/utils/functional-utils';
import { CollapsibleSectionExampleModule } from './collapsible-section-example.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `
  <b-collapsible-section
    [collapsible]="collapsible"
    [expanded]="expanded"
    [disabled]="disabled"

    [title]="title"
    [description]="description"


    (closed)="onPanelClosed($event)"
    (opened)="onPanelOpened($event)">

    <p>{{ content[1] }}</p>
    <p>{{ content[2] }}</p>
    <p>{{ content[0] }}</p>

  </b-collapsible-section>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Collapsible Section'" style="background-color: rgb(245,245,245);">

  <style>
    .exmpls-wrap > * {
      margin-bottom: 32px;
    }
  </style>

  <div class="exmpls-wrap" style="max-width: 1000px;">

   <b-collapsible-section-example-1
      [collapsible]="collapsible"
      [expanded]="expanded"
      [disabled]="disabled"
      (closed)="onPanelClosed($event)"
      (opened)="onPanelOpened($event)">
   </b-collapsible-section-example-1>

   <b-collapsible-section-example-2
      [title]="title"
      [description]="description"
      [collapsible]="collapsible"
      [expanded]="expanded"
      [disabled]="disabled"
      (closed)="onPanelClosed($event)"
      (opened)="onPanelOpened($event)">
   </b-collapsible-section-example-2>

</div>

</b-story-book-layout>
`;

const note = `
  ## Collapsible Section

  #### Module
  *CollapsibleSectionModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  expanded | boolean | if the panel is open | false
  disabled | boolean | if the panel is disabled (can't be opened) | false
  title | panel header title | title | ''
  description | string | panel header description | none (optional)

  Content marked with [suffix] will be projected into the right part of the panel header.


  #### Events
  Name | Description
  --- | ---
  opened | Emitted every time the panel is opened
  closed | Emitted every time the panel is closed

  ~~~
  ${template}
  ~~~
`;

story.add(
  'Collapsible Section',
  () => {
    return {
      template: storyTemplate,
      props: {
        collapsible: boolean('collapsible', false),
        expanded: boolean('expanded', false),
        disabled: boolean('disabled', false),
        title: text('title', mockText(randomNumber(2, 5))),
        description: text('description', mockText(randomNumber(3, 6))),
        onPanelOpened: action('Panel opened'),
        onPanelClosed: action('Panel closed')
      },
      moduleMetadata: {
        declarations: [],
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CollapsibleSectionModule,
          CollapsibleSectionExampleModule
        ],
        entryComponents: []
      }
    };
  },
  { notes: { markdown: note } }
);
