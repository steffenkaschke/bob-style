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
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { UtilComponentsModule } from '../../services/util-components/utilComponents.module';
import { mockText } from '../../mock.const';
import { randomNumber } from '../../services/utils/functional-utils';
import { TableCardComponent } from '../../table/card-table/table-card/table-card.component';
import { CardTableMockData } from '../../table/card-table/card-table.mock';
import { TableCardCellComponent } from '../../table/card-table/table-card-cell/table-card-cell.component';
import { ComponentRendererModule } from '../../services/component-renderer/component-renderer.module';
import { TruncateTooltipModule } from '../../services/truncate-tooltip/truncate-tooltip.module';
import { AvatarComponent } from '../../buttons-indicators/avatar/avatar.component';
import { ChipComponent } from '../../chips/chip/chip.component';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import { ChipModule } from '../../chips/chip/chip.module';
import { CollapsibleSectionExampleModule } from './collapsible-section-example.module';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `
  <b-collapsible-section
    [collapsible]="collapsible"
    [expanded]="expanded"
    [disabled]="disabled"

    [title]="title[0]"
    [description]="description[0]"


    (closed)="onPanelClosed($event)"
    (opened)="onPanelOpened($event)">

    <p>{{ content[1] }}</p>
    <p>{{ content[2] }}</p>
    <p>{{ content[0] }}</p>

  </b-collapsible-section>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Collapsible'" style="background-color: rgb(245,245,245);">
  <div style="max-width: none; margin: 0 -30px; padding: 0 50px; overflow: hidden;">

   <b-collapsible-section-example-1
      [collapsible]="collapsible"
      [expanded]="expanded"
      [disabled]="disabled">
   </b-collapsible-section-example-1>

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
  type | CollapsibleType | ennum to set panel type (small or big) | small
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
        collapsible: boolean('collapsible', true),
        expanded: boolean('expanded', false),
        disabled: boolean('disabled', false),

        title: array(
          'title',
          [
            mockText(randomNumber(3, 5)),
            mockText(randomNumber(3, 5)),
            mockText(randomNumber(3, 5))
          ],
          '\n'
        ),
        description: array(
          'description',
          [
            mockText(randomNumber(3, 8)),
            mockText(randomNumber(3, 8)),
            mockText(randomNumber(3, 8))
          ],
          '\n'
        ),

        content: array('content', [
          mockText(100),
          mockText(100),
          mockText(100)
        ]),

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
