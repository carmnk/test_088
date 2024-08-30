export const ENTITY_TYPES_MODEL_FIELD_DEFS = [
  {
    name: 'entity_type_id',
    data_type: 'serial PRIMARY KEY',
    is_id_field: true,
  } as const,
  {
    name: 'entity_type',
    data_type: 'varchar',
    required: true,
    ui_type: 'dropdown',
  } as const,
  {
    name: 'required_list_field_types',
    data_type: 'varchar []',
    required: true,
    // ui_type: 'dropdown',
  } as const,
]
type ENTITY_TYPES_MODEL_FIELD_DEFS_TYPE = typeof ENTITY_TYPES_MODEL_FIELD_DEFS
export type ENTITY_TYPE_MODEL_FIELDNAME_TYPE =
  ENTITY_TYPES_MODEL_FIELD_DEFS_TYPE[number]['name']
export type ENTITY_TYPE_TYPE = {
  entity_type_id: number
  entity_type: string
  required_list_field_types: string[]
  //   disable_backend_pagination?: boolean -> just leave out url params to get full data
}
// it is not possible to directly apply static typing restrictions and still infer the actual type of js object/fn..
type CheckJoiningsResponseKeys =
  ENTITY_TYPE_TYPE[ENTITY_TYPE_MODEL_FIELDNAME_TYPE] // Error here means ENTITY_MODEL_TYPE is missing a key!
