export type EntityJoiningType = {
  entity_joining_id: number
  base_entity_id: number
  base_entity_field_id: number
  linked_entity_id: number
  linked_entity_field_id: number
  sql_join_type: string
  //   disable_backend_pagination?: boolean -> just leave out url params to get full data
}

export type EntityJoiningPayloadType = EntityJoiningType & {
  owner_user_id?: number
  html_project_id: string
}

export const EntityJoiningDbFieldsDefs = [
  {
    name: 'entity_joining_id',
    data_type: 'serial PRIMARY KEY',
    is_id_field: true,
  } as const,
  {
    name: 'base_entity_id',
    data_type: 'integer references _entities(entity_id)',
    required: true,
    ui_type: 'dropdown',
  } as const,
  {
    name: 'base_entity_field_id',
    data_type: 'integer references _entity_fields(entity_field_id)',
    required: true,
    ui_type: 'dropdown',
  } as const,

  {
    name: 'linked_entity_id',
    data_type: 'integer references _entities(entity_id)',
    required: true,
    ui_type: 'dropdown',
  } as const,
  {
    name: 'linked_entity_field_id',
    data_type: 'integer references _entity_fields(entity_field_id)',
    required: true,
    ui_type: 'dropdown',
  } as const,

  { name: 'sql_join_type' as const, data_type: 'varchar', ui_type: 'dropdown' },

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
