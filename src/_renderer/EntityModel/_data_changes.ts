export const DATA_CHANGES_MODEL_FIELD_DEFS = [
  {
    name: 'data_change_id',
    data_type: 'serial PRIMARY KEY',
    is_id_field: true,
  } as const,
  {
    name: 'attribute_name',
    data_type: 'varchar',
    required: true,
  } as const,
  {
    name: 'path',
    data_type: 'varchar[]',
    required: true,
  } as const,
  {
    name: 'user_id',
    data_type: 'int',
    required: true,
  } as const,
  {
    name: 'entity_name',
    data_type: 'varchar',
    required: true,
  } as const,
  {
    name: 'entity_instance_id',
    data_type: 'int',
    required: true,
  } as const,
  {
    name: 'old_value',
    data_type: 'varchar',
    required: true,
  } as const,
  {
    name: 'new_value',
    data_type: 'varchar',
    required: true,
  } as const,
  {
    name: 'change_datetime',
    data_type: 'timestamp',
    required: true,
  } as const,
  {
    name: 'sql_query',
    data_type: 'varchar',
    required: true,
  } as const,
  {
    name: 'change_type',
    data_type: 'varchar', // main, sub, step
    required: true,
  } as const,
]
type DATA_CHANGES_MODEL_FIELD_DEFS_TYPE = typeof DATA_CHANGES_MODEL_FIELD_DEFS
export type DATA_CHANGES__MODEL_FIELDNAME_TYPE =
  DATA_CHANGES_MODEL_FIELD_DEFS_TYPE[number]['name']
export type DATA_CHANGES_TYPE = {
  data_change_id: number
  attribute_name: string
  path: string[]
  user_id: number
  entity_name: string
  entity_instance_id: number
  old_value: string
  new_value: string
  change_datetime: string
  sql_query: string
  change_type: 'main' | 'sub' | 'step'
}
// it is not possible to directly apply static typing restrictions and still infer the actual type of js object/fn..
type CheckJoiningsResponseKeys =
  DATA_CHANGES_TYPE[DATA_CHANGES__MODEL_FIELDNAME_TYPE] // Error here means ENTITY_MODEL_TYPE is missing a key!
