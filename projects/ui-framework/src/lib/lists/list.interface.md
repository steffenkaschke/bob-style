#### interface: SelectGroupOption
Name | Type | Description
--- | --- | ---
groupName | string | group display name
key | string / number | grpup ID
options | SelectOption[] | array of options
 + | any | you can pass any additional properties in the SelectGroupOption object

#### interface: SelectOption
Name | Type | Description
--- | --- | ---
value | string | option display name
id | number / string | option ID - **Must be unique!**
selected | boolean | if option is selected
prefixComponent |  RenderedComponent | object, describing component to be rendered in the option (see [Component Renderer](https://hibobio.github.io/bob-style/?path=/story/services--component-renderer))
disabled | boolean | if option is disabled
hidden | boolean | if options is hidden, it will not be displayed in the list
 + | any | you can pass any additional properties in the SelectOption object

#### interface: ListFooterActions
Name | Type | Description
--- | --- | ---
apply | boolean | enable Apply button.<br> Defaults to <u>false</u> for SingleSelect and <u>true</u> for MultiSelect
cancel | boolean | enable Cancel button.<br> Defaults to <u>false</u> for SingleSelect and <u>true</u> for MultiSelect
clear | boolean | enable Clear button.<br> Defaults to <u>false</u> for SingleSelect and <u>true</u> for MultiSelect.<br> **Note:** If `[optionsDefault]` is present, this sets automatically to <u>false</u>
reset | boolean | enable Reset button.<br> Defaults to <u>false</u>.<br> **Note:** If `[optionsDefault]` is present, this sets automatically to <u>true</u>

#### class: ListChange - methods
Name | Type | Description
--- | --- | ---
getSelectGroupOptions | (): SelectGroupOption[] | returns all options
getSelectedGroupOptions | (): SelectGroupOption[] | returns **selected** options
getSelectedIds | (): (number / string)[] | returns array of selected option **IDs**