export const SESSIONS_MODEL_FIELD_DEFS = [
  {
    name: 'session_id',
    data_type: 'serial PRIMARY KEY',
    is_id_field: true,
  } as const,
  {
    name: 'session_token',
    data_type: 'varchar',
    required: true,
  } as const,
  {
    name: 'email',
    data_type: 'varchar',
    required: true,
  } as const,
  {
    name: 'expires_at',
    data_type: 'timestamp',
    required: true,
  } as const,
  {
    name: 'gh_user_token',
    data_type: 'varchar',
    required: true,
  } as const,
]
type SESSIONS_MODEL_FIELD_DEFS_TYPE = typeof SESSIONS_MODEL_FIELD_DEFS
export type USERS_MODEL_FIELDNAME_TYPE =
  SESSIONS_MODEL_FIELD_DEFS_TYPE[number]['name']
export type SESSION_TYPE = {
  session_id: number
  session_token: string
  email: string
  expires_at: string
  gh_user_token: string
}
// it is not possible to directly apply static typing restrictions and still infer the actual type of js object/fn..
type CheckJoiningsResponseKeys = SESSION_TYPE[USERS_MODEL_FIELDNAME_TYPE] // Error here means ENTITY_MODEL_TYPE is missing a key!
