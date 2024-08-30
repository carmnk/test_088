export type EntityListFieldType =
  | {
      required_list_field_type: string
      entity_list_field_id: number
      entity_list_id: number
      src_entity_field_id: number
      fe_mapping_fn_name?: string // not recommended since sorting in BE
      list_field_type?: 'text' // | "color"
      is_filtered?: boolean
      is_sortable?: boolean
      is_editable?: boolean
      label?: string
      list_sequence?: number
    }
  | {
      required_list_field_type: string
      entity_list_field_id: number
      entity_list_id: number
      //   dependant_fields?: string[] needed for non greedy db fetch strategy -> not needed for select * ...
      src_be_mapping_fn_name: string
      fe_mapping_fn_name?: string // not recommended since sorting in BE
      list_field_type?: 'text' // | "color"
      is_filtered?: boolean
      is_sortable?: boolean
      is_editable?: boolean
      label?: string
      list_sequence?: number
    }

export type EntityListFieldPayloadType = EntityListFieldType & {
  owner_user_id?: number
  html_project_id: string
}

// ENTITY_LISTS_FIELDS
export const EntityListFieldDbFieldsDefs = [
  {
    name: 'entity_list_field_id',
    data_type: 'serial PRIMARY KEY',
    is_id_field: true,
  } as const,
  {
    name: 'entity_list_id',
    data_type: 'integer references _entity_lists(entity_list_id) ',
    ui_type: 'dropdown',
  } as const,
  { name: 'label', data_type: 'varchar', required: true } as const,
  {
    name: 'src_entity_field_id',
    data_type: 'integer references _entity_fields(entity_field_id) ',
    ui_type: 'dropdown',
  } as const,

  { name: 'src_be_mapping_fn_name', data_type: 'varchar' } as const,
  // { name: 'fe_mapping_fn_name', data_type: 'varchar' } as const, // not recommended since sorting in BE
  // { name: 'list_field_type', data_type: 'varchar' } as const,
  { name: 'is_filtered', data_type: 'bool' } as const,
  { name: 'is_sortable', data_type: 'bool' } as const,
  { name: 'is_editable', data_type: 'bool' } as const,
  {
    name: 'required_list_field_type',
    data_type: 'varchar',
    required: true,
    ui_type: 'dropdown',
  } as const,
  { name: 'list_sequence', data_type: 'integer' } as const,

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
