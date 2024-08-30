export type EntityValueType = {
  entity_values_id: number
  base_entity_id: number
  //   id_column_ ?? -> entity_fields -> is_id_field
  list_label?: string
  type?: string
  sql_format_parmeter?: string
  fe_mapping_key?: string
  name?: string
}

export type EntityValuePayloadType = EntityValueType & {
  owner_user_id?: number
  html_project_id?: string
}

export const EntityValuesDbFieldsDefs = [
  {
    name: 'entity_values_id',
    data_type: 'serial PRIMARY KEY',
    is_id_field: true,
  } as const,
  {
    name: 'name',
    data_type: 'varchar',
    required: true,
  } as const, // or name
  {
    name: 'base_entity_id',
    data_type: 'integer references _entities(entity_id)',
    required: true,
    ui_type: 'dropdown',
  } as const, // or name
  {
    name: 'type' as const,
    data_type: 'varchar',
    required: true,
    ui_type: 'dropdown',
  }, // "all", "format"
  { name: 'sql_format_parmeter' as const, data_type: 'varchar' }, //
  { name: 'fe_mapping_key' as const, data_type: 'varchar' }, //

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
