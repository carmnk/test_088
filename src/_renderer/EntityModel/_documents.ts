export const DOCUMENTS_MODEL_FIELD_DEFS = [
  {
    name: 'document_id',
    data_type: 'serial PRIMARY KEY',
    is_id_field: true,
  } as const,
  {
    name: 'user_id',
    data_type: 'integer references _users (user_id)',
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
    name: 'filename',
    data_type: 'varchar',
    required: true,
  } as const,
  {
    name: 'document_key',
    data_type: 'varchar',
    required: true,
  } as const,

  {
    name: 'upload_date',
    data_type: 'timestamp',
    required: true,
  } as const,
]
type DOCUMENTS_MODEL_FIELD_DEFS_TYPE = typeof DOCUMENTS_MODEL_FIELD_DEFS
export type DOCUMENTS_MODEL_FIELDNAME_TYPE =
  DOCUMENTS_MODEL_FIELD_DEFS_TYPE[number]['name']
export type DOCUMENTS_TYPE = {
  document_id: number
  user_id: number
  entity_name: string
  entity_instance_id: number
  filename: string
  document_key: string
  upload_date: Date
}
// it is not possible to directly apply static typing restrictions and still infer the actual type of js object/fn..
type CheckJoiningsResponseKeys = DOCUMENTS_TYPE[DOCUMENTS_MODEL_FIELDNAME_TYPE] // Error here means ENTITY_MODEL_TYPE is missing a key!
