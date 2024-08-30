export const USERS_MODEL_FIELD_DEFS = [
  {
    name: 'user_id',
    data_type: 'serial PRIMARY KEY',
    is_id_field: true,
  } as const,
  {
    name: 'email',
    data_type: 'varchar',
    required: true,
  } as const,
  {
    name: 'first_name',
    data_type: 'varchar',
    required: true,
  } as const,
  {
    name: 'last_name',
    data_type: 'varchar',
    required: true,
  } as const,
  {
    name: 'password',
    data_type: 'varchar',
    required: true,
  } as const,
]
type USERS_MODEL_FIELD_DEFS_TYPE = typeof USERS_MODEL_FIELD_DEFS
export type USERS_MODEL_FIELDNAME_TYPE =
USERS_MODEL_FIELD_DEFS_TYPE[number]['name']

export type USER_TYPE = {
  user_id: number
  email: string
  first_name: string
  last_name: string
  password: string
}
// it is not possible to directly apply static typing restrictions and still infer the actual type of js object/fn..
type CheckJoiningsResponseKeys = USER_TYPE[USERS_MODEL_FIELDNAME_TYPE] // Error here means ENTITY_MODEL_TYPE is missing a key!
