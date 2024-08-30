import { EntityJoiningDbFieldsDefs, EntityJoiningType } from './entity_joinings'
import {
  EntityListFieldDbFieldsDefs,
  EntityListFieldType,
} from './entity_list_fields'

import { EntityDbFieldsDefs, EntityType } from './entities'
import { EntityValueType, EntityValuesDbFieldsDefs } from './entity_values'
import { EntityFieldDbFieldsDefs, EntityFieldType } from './entitiy_fields'
import { EntityListDbFieldsDefs, EntityListType } from './entity_lists'

/** An object to initialize the database tables required for the entity data model
 * @keys The object's property keys represent the table_name in the database
 * @values The object's property values represent the table columns in the database (DatabaseFieldDefinitionType[])
 **/
export const EntityDataModelTableFieldDefs = {
  _entities: EntityDbFieldsDefs,
  _entity_fields: EntityFieldDbFieldsDefs,
  _entity_lists: EntityListDbFieldsDefs,
  _entity_list_fields: EntityListFieldDbFieldsDefs,
  _entity_values: EntityValuesDbFieldsDefs,
  _entity_joinings: EntityJoiningDbFieldsDefs,
  // _entity_types: ENTITY_TYPES_MODEL_FIELD_DEFS,
  // _users: USERS_MODEL_FIELD_DEFS,
  // _data_changes: DATA_CHANGES_MODEL_FIELD_DEFS,
  // _sessions: SESSIONS_MODEL_FIELD_DEFS,
  // _documents: DOCUMENTS_MODEL_FIELD_DEFS,
}

export type BASIC_ENTITY_MODEL_TYPE = {
  _entities: EntityType[]
  _entity_fields: EntityFieldType[]
  _entity_lists: EntityListType[]
  _entity_list_fields: EntityListFieldType[]
  _entity_joinings: EntityJoiningType[]
  _entity_values: EntityValueType[]
  // entity_types: ENTITY_TYPE_TYPE[]

  // _users: USER_TYPE[]
  // _change_changes: DATA_CHANGES_TYPE[]
}

export type ENRICHED_ENTITY_FIELDS_MODEL_TYPE = EntityFieldType & {
  entity?: EntityType | null
}
type ENRICHED_ENTITY_LIST_MODEL_TYPE = EntityListType & {
  entity: EntityType | null
}
type ENRICHED_ENTITY_LIST_FIELD_MODEL_TYPE = EntityListFieldType & {
  entity_field: ENRICHED_ENTITY_FIELDS_MODEL_TYPE | null
}
type ENRICHED_ENTITY_VALUES_MODEL_TYPE = EntityValueType & {
  entity: EntityType | null
}
export type ENRICHED_ENTITY_JOININGS_MODEL_TYPE = EntityJoiningType & {
  base_entity: EntityType | null
  linked_entity: EntityType | null
  linked_entity_fields: ENRICHED_ENTITY_FIELDS_MODEL_TYPE[] | null
  base_entity_fields: ENRICHED_ENTITY_FIELDS_MODEL_TYPE[] | null
}

export type EntityModelType = {
  _entities: EntityType[]
  _entity_fields: ENRICHED_ENTITY_FIELDS_MODEL_TYPE[]
  _entity_lists: ENRICHED_ENTITY_LIST_MODEL_TYPE[]
  _entity_list_fields: ENRICHED_ENTITY_LIST_FIELD_MODEL_TYPE[]
  _entity_values: ENRICHED_ENTITY_VALUES_MODEL_TYPE[]
  _entity_joinings: ENRICHED_ENTITY_JOININGS_MODEL_TYPE[]
  // structuredEntityJoinings?: ENRICHED_ENTITY_JOININGS_MODEL_TYPE[][]
  // _entity_types: ENTITY_TYPE_TYPE[]
  // _users: USER_TYPE[]
  // _change_changes: DATA_CHANGES_TYPE[]
}
