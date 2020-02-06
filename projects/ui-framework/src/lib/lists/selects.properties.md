#### Single/Multi Select common properties
Name | Type | Description | Default
--- | --- | --- | ---
[options] | SelectGroupOption[] | model of selection group | &nbsp;
[optionsDefault] | SelectGroupOption[] | Default options. If present, the Clear button (if enabled) will be replaced with Reset button, that will set the options state to optionsDefault (not relevant for SingleSelect) | &nbsp;
[showSingleGroupHeader] | boolean | display single group with group header (if false, as default, options will be displayed flat, without group) | <u>false</u>
[startWithGroupsCollapsed] | boolean | if true, will start with groups closed | true
[listActions] | ListFooterActions | enable/disable footer action buttons (clear, apply, reset).<br> **Note:** If you provide strings as truthy values, they will be used for button texts, instead of defaults. | (see interface doc below)
[panelClass] | string | class to be added to select panel | &nbsp;
[panelPosition] | PanelDefaultPosVer / ConnectedPosition[] | defines the location of the select's panel | &nbsp;
[tooltipType] | TruncateTooltipType | you can use CSS or Material tooltip for truncated value text | CSS
[hasPrefix] | boolean | if you are providing `input-prefix` ng-content, set this to true | false
&nbsp; | &nbsp; | &nbsp; | &nbsp;
**(selectChange)** | EventEmitter<wbr>&lt;ListChange&gt; | emits ListChange (in case of MultiSelect - after Apply) | &nbsp;
**(changed)** | EventEmitter<wbr>&lt;string/number&gt; | emits selected option ID(s) (in case of MultiSelect - after Apply).<br>**Note:** If you need <u>just the options' IDs</u>, bind to this output | &nbsp;
(opened) | EventEmitter<wbr>&lt;OverlayRef&gt; | emits OverlayRef on panel open | &nbsp;
(closed) | EventEmitter<wbr>&lt;void&gt; | emits on panel close | &nbsp;
&nbsp; | &nbsp; | &nbsp; | &nbsp;
&lt;elem input-prefix&gt; | ng-content | element with attribute `input-prefix` will be placed on the left of the 'input' box, before the value | &nbsp;
&lt;elem footerAction&gt; | ng-content | element with attribute `footerAction` will be placed in the footer of the panel | &nbsp;
&lt;elem footerActionRight&gt; | ng-content | element with attribute `footerActionRight` will be placed in the footer and aligned to the right | &nbsp;

#### Single/Multi Select common methods
Name | Description
--- | ---
openPanel() | will open select panel
closePanel() | will close (destroy) select panel