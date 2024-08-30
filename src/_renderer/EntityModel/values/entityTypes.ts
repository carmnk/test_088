export enum ENTITY_TYPE {
  treeview = 'treeview',
}
const enumObject = ENTITY_TYPE

export const ENTITY_TYPE_OPTIONS = Object.keys(enumObject).map((key) => ({
  value: enumObject[key as keyof typeof enumObject],
  label: enumObject[key as keyof typeof enumObject],
}))
