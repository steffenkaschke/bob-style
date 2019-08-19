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
import { values } from 'lodash';
import { ComponentGroupType } from '../../consts';
import { CollapsibleModule } from './collapsible2.module';
import { CollapsibleType } from './collapsible2.enum';
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

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template = `
  <b-collapsible2
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

  </b-collapsible2>
`;

const template2 = `
  <b-collapsible2
    [collapsible]="true"
    [expanded]="expanded"
    [disabled]="disabled"



    (closed)="onPanelClosed($event)"
    (opened)="onPanelOpened($event)">


    <b-table-card header [meta]="tableCardMeta" [row]="tableCardRow">
    </b-table-card>

    <div content>
      <p>{{ content[0] }}</p>
      <p>{{ content[1] }}</p>
      <p>{{ content[2] }}</p>
    </div>

  </b-collapsible2>
`;

const template3 = `
  <b-collapsible2
    [collapsible]="collapsible"
    [expanded]="expanded"
    [disabled]="disabled"

    [title]="title[2]"
    [description]="description[2]"


    (closed)="onPanelClosed($event)"
    (opened)="onPanelOpened($event)">

    <p>{{ content[2] }}</p>
    <p>{{ content[0] }}</p>
    <p>{{ content[1] }}</p>

  </b-collapsible2>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Collapsible'" style="background-color: rgb(245,245,245);">
  <div style="max-width: none; margin: 0 -30px; padding: 0 50px; overflow: hidden;">
    ${template}
    ${template2}
    ${template3}
</div>

</b-story-book-layout>
`;

const note = `
  ## Collapsible panel

  #### Module
  *CollapsibleModule*

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

const typeOptions = values(CollapsibleType);

const tableCardMeta = [
  {
    id: 1,
    name: 'Requested For',
    width: 25
  },
  {
    id: 2,
    name: 'Subject',
    textStyle: {
      fontWeight: '500'
    },
    width: 18
  },
  {
    id: 3,
    name: 'Requested by'
  },
  {
    id: 4,
    name: 'Assignee'
  }
];

const tableCardRow = CardTableMockData[1].slice(1);

story.add(
  'Collapsible2',
  () => {
    return {
      template: storyTemplate,
      props: {
        collapsible: boolean('collapsible', false),
        type: select('type', typeOptions, CollapsibleType.small),
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
        onPanelClosed: action('Panel closed'),

        tableCardMeta: object('tableCardMeta', tableCardMeta),
        tableCardRow: object('tableCardRow', tableCardRow)
      },
      moduleMetadata: {
        declarations: [TableCardComponent, TableCardCellComponent],
        imports: [
          StoryBookLayoutModule,
          BrowserAnimationsModule,
          CollapsibleModule,
          ButtonsModule,
          UtilComponentsModule,
          TruncateTooltipModule,
          ComponentRendererModule,
          AvatarModule,
          ChipModule
        ],
        entryComponents: [AvatarComponent, ChipComponent]
      }
    };
  },
  { notes: { markdown: note } }
);
