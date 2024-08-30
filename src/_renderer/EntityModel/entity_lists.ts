export type EntityListType = {
  entity_list_id: number
  base_entity_id: number
  //   id_column_ ?? -> entity_fields -> is_id_field
  list_label?: string
  disable_create_entity?: boolean
  disable_edit_entity?: boolean
  disable_delete_entity?: boolean
  //   disable_backend_pagination?: boolean -> just leave out url params to get full data
  disable_excel_export?: boolean
  list_type: string
}
export type EntityListPayloadType = EntityListType & {
  owner_user_id?: number
  html_project_id: string
}

export type EntityTypeKeys = keyof EntityListType

// ENTITY_LISTS
export const EntityListDbFieldsDefs = [
  {
    name: 'entity_list_id',
    data_type: 'serial PRIMARY KEY',
    is_id_field: true,
  } as const,
  {
    name: 'base_entity_id',
    data_type: 'integer references _entities(entity_id)',
    required: true,
    ui_type: 'dropdown',
  } as const, // or name
  { name: 'list_label' as const, data_type: 'varchar' },
  { name: 'list_type' as const, data_type: 'varchar', ui_type: 'dropdown' },
  // { name: 'disable_create_entity' as const, data_type: 'bool' },
  // { name: 'disable_edit_entity' as const, data_type: 'bool' },
  // { name: 'disable_delete_entity' as const, data_type: 'bool' },
  // { name: 'disable_excel_export' as const, data_type: 'bool' },
 
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
