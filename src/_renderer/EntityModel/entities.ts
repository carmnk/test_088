import { DatabaseFieldDefinitionType } from './databaseDefinitionType'

export type EntityType = {
  entity_id: number
  entity_name: string
  entity_label?: string
  // disable_create_entity?: boolean
  // disable_edit_entity?: boolean
  // disable_delete_entity?: boolean
}
export type EntityPayloadType = EntityType & {
  owner_user_id?: number
  html_project_id: string
}

export type EntityTypeKeys = keyof EntityType

export const EntityDbFieldsDefs: DatabaseFieldDefinitionType[] = [
  {
    name: 'entity_id' as const,
    data_type: 'serial PRIMARY KEY',
    is_id_field: true,
  },
  { name: 'entity_name' as const, data_type: 'varchar', required: true },
  { name: 'entity_label' as const, data_type: 'varchar' },
  // { name: 'disable_create_entity' as const, data_type: 'bool' },
  // { name: 'disable_edit_entity' as const, data_type: 'bool' },
  // { name: 'disable_delete_entity' as const, data_type: 'bool' },

  // only for server side
  {
    name: 'owner_user_id' as const,
    data_type: 'integer references _users (user_id)',
  },
  {
    name: 'html_project_id' as const,
    data_type: 'varchar references html_projects (project_id)',
  },
]
