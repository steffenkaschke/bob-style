export enum FormEvents {
  changed = 'changed',
  focused = 'focused',
  blurred = 'blurred',
  inputEvents = 'inputEvents',
  dateChange = 'dateChange',
  checkboxChange = 'checkboxChange',
  radioChange = 'radioChange',
  selectChange = 'selectChange',
  selectModified = 'selectModified',
  selectCancelled = 'selectCancelled',
  socialInputChange = 'socialInputChange',
  elementChange = 'elementChange'
}

export enum InputEventType {
  onFocus = 'focus',
  onBlur = 'blur',
  onChange = 'change',
  onWrite = 'write',
  onKey = 'keydown'
}
