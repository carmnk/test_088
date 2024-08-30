export enum VALUES_ENTITY_TYPE {
  all = 'all',
  format = 'format',
}

export const VALUES_ENTITY_TYPE_OPTIONS = Object.keys(VALUES_ENTITY_TYPE).map((key) => ({
  value: VALUES_ENTITY_TYPE[key as keyof typeof VALUES_ENTITY_TYPE],
  label: VALUES_ENTITY_TYPE[key as keyof typeof VALUES_ENTITY_TYPE],
}))
