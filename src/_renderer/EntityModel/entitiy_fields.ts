import { DATATYPE } from './defs/datatypes'

export type EntityFieldType = {
  entity_field_id: number
  entity_id: number
  name: string
  form_label: string
  data_type: DATATYPE
  ui_type?: 'default' | 'textarea' | 'dropdown' | 'autocomplete'
  ui_autocomplete_accept_custom_values?: boolean
  options_values_id?: number
  default_value?: string
  is_nullable?: boolean
  is_id_field?: boolean
  layout_width12?: number // 1...12 (12 is full width, 1 is 1/12 width)
  layout_fill_width?: boolean
  formOrder?: (string | number)[]
  reference_entity_field_id?: number
  required_list_field_type?: string
  form_sequence?: number
}

export type EntityFieldPayloadType = EntityFieldType & {
  owner_user_id?: number
  html_project_id: string
}

export type EntityFieldTypeKeys = keyof EntityFieldType

export const EntityFieldDbFieldsDefs = [
  {
    name: 'entity_field_id' as const,
    data_type: 'serial PRIMARY KEY',
    is_id_field: true,
  },
  {
    name: 'entity_id' as const,
    data_type: 'integer references _entities (entity_id)',
    required: true,
    ui_type: 'dropdown',
  }, // foreign key!  / or entity_name
  {
    name: 'name' as const,
    data_type: 'varchar',
    required: true,
    width12: 6,
    fillWidth: true,
  } as const,
  { name: 'is_id_field', data_type: 'bool' } as const,
  {
    name: 'data_type',
    data_type: 'varchar',
    required: true,
    ui_type: 'dropdown',
    width12: 6,
  } as const,
  {
    name: 'ui_type',
    data_type: 'varchar',
    ui_type: 'dropdown',
    width12: 6,
  } as const,
  {
    name: 'options_values_id',
    data_type: 'integer references _entity_values (entity_values_id)',
    ui_type: 'dropdown',
    width12: 6,
  } as const, // foreign key!
  { name: 'ui_autocomplete_accept_custom_values', data_type: 'bool' } as const,

  {
    name: 'reference_entity_field_id',
    data_type: 'integer references _entity_fields (entity_field_id)',
    ui_type: 'dropdown',
    width12: 6,
  } as const,
  {
    name: 'form_label' as const,
    data_type: 'varchar',
    required: true,
  } as const,
  { name: 'layout_width12', data_type: 'integer', width12: 6 } as const, // 1...12 (12 is full width, 1 is 1/12 width)
  { name: 'layout_fill_width', data_type: 'bool', width12: 6 } as const,
  // { name: 'default_value', data_type: 'varchar' } as const,
  // { name: 'is_nullable', data_type: 'bool' } as const,

  { name: 'form_sequence', data_type: 'integer' } as const,

  // user management
  {
    name: 'owner_user_id' as const,
    data_type: 'integer references _users (user_id)',
  },
  {
    name: 'html_project_id' as const,
    data_type: 'varchar references html_projects (project_id)',
  },
]

export const compareFormSequenceFn = (a: any, b: any, sequenceKey: string) =>
  typeof a?.[sequenceKey] === 'number' && typeof b?.[sequenceKey] === 'number'
    ? a?.[sequenceKey] - b?.[sequenceKey]
    : 0

export const sortByFormSequence = (entityFields: any[], sequenceKey: string) =>
  typeof entityFields?.[0]?.[sequenceKey] === 'number'
    ? entityFields?.sort((a, b) => compareFormSequenceFn(a, b, sequenceKey))
    : entityFields
