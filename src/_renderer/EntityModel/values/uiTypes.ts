export enum UI_TYPE {
  default = 'default',
  dropdown = 'dropdown',
  autocomplete = 'autocomplete',
}

export const UI_TYPE_OPTIONS = Object.keys(UI_TYPE).map((key) => ({
  value: key,
  label: key,
}))
