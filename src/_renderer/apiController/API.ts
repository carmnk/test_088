import { MatchingObjectKeys } from './Types/general'
import { makeApiQuery } from './00_utils/makeApiQuery'
import { EntityModelType } from '../EntityModel/entityDataModel'
import { EntityPayloadType } from '../EntityModel/entities'
import { EntityFieldPayloadType } from '../EntityModel/entitiy_fields'
import { EntityValuePayloadType } from '../EntityModel/entity_values'
import { EntityListPayloadType } from '../EntityModel/entity_lists'
import { EntityListFieldPayloadType } from '../EntityModel/entity_list_fields'
import { EntityJoiningPayloadType } from '../EntityModel/entity_joinings'

//SETTING BASE URL
//SETTING BASE URL
export const BASE_URL = import.meta.env.VITE_BE_SERVER_URL

export const API = {
  login: makeApiQuery<any, any>('auth/login', 'POST'),
  logout: makeApiQuery<any, any>('auth/logout', 'POST'),

  verifyGithubLogin: makeApiQuery<{ code: string }, any>(
    '_github/login',
    'POST'
  ),
  createGithubPages: (project_id: string) =>
    makeApiQuery<any, any>(`_api/editor/gh-pages/${project_id}`, 'POST'),
  deleteGithubPages: (project_id: string) =>
    makeApiQuery<any, any>(`_api/editor/gh-pages/${project_id}`, 'DELETE'),

  getGithubUserRepos: makeApiQuery<any, any>('_github/user/repos'),
  githubTest: makeApiQuery<{ name: string }, any>('_github/repo/test', 'POST'),
  githubTest2: makeApiQuery<{ name: string }, any>(
    '_github/repo/test2',
    'POST'
  ),

  test: makeApiQuery<any, any>('auth/test', 'POST'),
  saveProject: (project_id: number | string) =>
    makeApiQuery<any, any>(`api/project/${project_id}`, 'POST'),
  saveProjectImages: (project_id: number | string) =>
    makeApiQuery<any, any>(`api/project/${project_id}/images`, 'POST'),

  saveGithubRepo: makeApiQuery<{ project_id: number }, any>(
    '_api/editor/save-repo',
    'POST'
  ),
  loadProject: (project_id: string | number) =>
    makeApiQuery<any, any>(`_api/editor/load/${project_id}`, 'GET'),
  cloneProject: (project_id: string | number) =>
    makeApiQuery<any, any>(`_api/editor/clone/${project_id}`, 'GET'),
  deleteProject: (project_id: string | number) =>
    makeApiQuery<any, any>(`_api/editor/delete/${project_id}`, 'DELETE'),

  getProjects: makeApiQuery<any, any>('_api/editor/projects', 'GET'),
  getAsset: (asset_id: string | number) =>
    makeApiQuery<any, any>(`_api/editor/assets/${asset_id}`, 'GET_FILE'),
  getSharedAsset: (user_id: number, asset_id: string | number) =>
    makeApiQuery<any, any>(
      `_api/editor/shared_assets/${user_id}/${asset_id}`,
      'GET_FILE'
    ),

  exportProjectToZip: (project_id: string | number) =>
    makeApiQuery<any, any>(`_api/editor/export/${project_id}`, 'POST'),

  // ENTITY MODEL

  getEntityModel: makeApiQuery<undefined, EntityModelType>(
    '_api/v1/_entity_model',
    'GET'
  ),
  createEntity: makeApiQuery<EntityPayloadType, any>(
    '_api/v1/_entities/add',
    'POST'
  ),
  editEntity: (entity_id: number) =>
    makeApiQuery<EntityPayloadType, any>(
      `_api/v1/_entities/${entity_id}`,
      'PUT'
    ),
  deleteEntity: (entity_id: number) =>
    makeApiQuery<undefined, any>(`_api/v1/_entities/${entity_id}`, 'DELETE'),

  createEntityField: makeApiQuery<EntityFieldPayloadType, any>(
    '_api/v1/_entity_fields/add',
    'POST'
  ),
  editEntityField: (entity_id: number) =>
    makeApiQuery<EntityFieldPayloadType, any>(
      `_api/v1/_entity_fields/${entity_id}`,
      'PUT'
    ),
  deleteEntityField: (entity_id: number) =>
    makeApiQuery<undefined, any>(
      `_api/v1/_entity_fields/${entity_id}`,
      'DELETE'
    ),

  createEntityValue: makeApiQuery<EntityValuePayloadType, any>(
    `_api/v1/_entity_values/add`,
    'POST'
  ),
  editEntityValue: (entity_value_id: number) =>
    makeApiQuery<EntityValuePayloadType, any>(
      `_api/v1/_entity_values/${entity_value_id}`,
      'PUT'
    ),
  deleteEntityValue: (entity_value_id: number) =>
    makeApiQuery<undefined, any>(
      `_api/v1/_entity_values/${entity_value_id}`,
      'DELETE'
    ),

  createEntityList: makeApiQuery<EntityListPayloadType, any>(
    `_api/v1/_entity_lists/add`,
    'POST'
  ),
  editEntityList: (entity_list_id: number) =>
    makeApiQuery<EntityListPayloadType, any>(
      `_api/v1/_entity_lists/${entity_list_id}`,
      'PUT'
    ),
  deleteEntityList: (entity_list_id: number) =>
    makeApiQuery<undefined, any>(
      `_api/v1/_entity_lists/${entity_list_id}`,
      'DELETE'
    ),

  createEntityListField: makeApiQuery<EntityListFieldPayloadType, any>(
    `_api/v1/_entity_list_fields/add`,
    'POST'
  ),
  editEntityListField: (entity_list_field_id: number) =>
    makeApiQuery<EntityListFieldPayloadType, any>(
      `_api/v1/_entity_list_fields/${entity_list_field_id}`,
      'PUT'
    ),
  deleteEntityListField: (entity_list_field_id: number) =>
    makeApiQuery<undefined, any>(
      `_api/v1/_entity_list_fields/${entity_list_field_id}`,
      'DELETE'
    ),
  createEntityJoining: makeApiQuery<EntityJoiningPayloadType, any>(
    `_api/v1/_entity_joinings/add`,
    'POST'
  ),
  editEntityJoining: (entity_joining_id: number) =>
    makeApiQuery<EntityJoiningPayloadType, any>(
      `_api/v1/_entity_joinings/${entity_joining_id}`,
      'PUT'
    ),
  deleteEntityJoining: (entity_joining_id: number) =>
    makeApiQuery<undefined, any>(
      `_api/v1/_entity_joinings/${entity_joining_id}`,
      'DELETE'
    ),

  // BASE-FULLSTACK

  // editEntity: (entity_category: string, id: number) =>
  //   makeApiQuery<any, any>(`admin/${entity_category}/${id}`, 'PUT'),

  // getPaginatedEntityInstances
  getPagedEntityInstances: (entity_list_id: number) =>
    makeApiQuery<any, any>(`data/list/${entity_list_id}`),
  getPagedEntityInstancesXlsxExport: (entity_list_id: number) =>
    makeApiQuery<any, any>(`data/export/${entity_list_id}/xlsx/`, 'GET_FILE'),

  getEntityInstance: (entity_id: number, instance_id: number) =>
    makeApiQuery<any, any>(`data/e/${entity_id}/${instance_id}`, 'GET'),

  editEntityInstance: (entity_id: number, instance_id: number) =>
    makeApiQuery<any, any>(`data/e/${entity_id}/${instance_id}`, 'PUT'),
  deleteEntityInstance: (entity_id: number, instance_id: number) =>
    makeApiQuery<any, any>(`data/e/${entity_id}/${instance_id}`, 'DELETE'),
  createEntityInstance: (entity_id: number) =>
    makeApiQuery<any, any>(`data/e/${entity_id}`, 'POST'),

  getEntityValues: (entity_values_id: number) =>
    makeApiQuery<any, any>(`data/v/${entity_values_id}`, 'GET'),

  getDataChanges: (entityListId: number | string, entityInstanceId: number) =>
    makeApiQuery<any, any>(`_dc/${entityListId}/${entityInstanceId}`, 'GET'),

  // documents
  uploadDocument: () => makeApiQuery<FormData, any>(`_doc/`, 'POST'),
  downloadDocument: (document_id: number) =>
    makeApiQuery<undefined, any>(`_doc/${document_id}`, 'GET_FILE'),
  replaceDocument: (document_id: number) =>
    makeApiQuery<FormData, any>(`_doc/${document_id}`, 'PUT'),
  deleteDocument: (document_id: number) =>
    makeApiQuery<undefined, any>(`_doc/${document_id}`, 'DELETE'),
}

//
type API_TYPE = typeof API
type API_TYPE_KEYS = keyof API_TYPE

// eslint-disable-next-line @typescript-eslint/ban-types
type API_FUNCTION_KEYS = MatchingObjectKeys<API_TYPE, Function>
type API_OBJECT_KEYS = Exclude<API_TYPE_KEYS, API_FUNCTION_KEYS>

// type API_QUERY_PARAMS = ReturnType<API_TYPE[API_FUNCTION_KEYS]>

type SPECIFIC_API_FUNCTION_QUERY_PARAMS<
  T extends API_FUNCTION_KEYS = API_FUNCTION_KEYS
> = ReturnType<API_TYPE[T]>
type SPECIFIC_API_OBJECT_QUERY_PARAMS<
  T extends API_OBJECT_KEYS = API_OBJECT_KEYS
> = API_TYPE[T]

export type SPECIFIC_API_OBJECT_RESPONSE_TYPE<
  T extends API_OBJECT_KEYS = API_OBJECT_KEYS
> = ReturnType<SPECIFIC_API_OBJECT_QUERY_PARAMS<T>['query']>
export type SPECIFIC_API_FUNCTION_RESPONSE_TYPE<
  T extends API_FUNCTION_KEYS = API_FUNCTION_KEYS
> = ReturnType<SPECIFIC_API_FUNCTION_QUERY_PARAMS<T>['query']>

export type SPECIFIC_API_OBJECT_PAYLOAD_TYPE<
  T extends API_OBJECT_KEYS = API_OBJECT_KEYS
> = Parameters<SPECIFIC_API_OBJECT_QUERY_PARAMS<T>['query']>[0]
export type SPECIFIC_API_FUNCTION_PAYLOAD_TYPE<
  T extends API_FUNCTION_KEYS = API_FUNCTION_KEYS
> = Parameters<SPECIFIC_API_FUNCTION_QUERY_PARAMS<T>['query']>[0]

export type API_QUERY_RESPONSE_TYPE<
  T extends API_FUNCTION_KEYS | API_OBJECT_KEYS
> = T extends API_OBJECT_KEYS
  ? SPECIFIC_API_OBJECT_RESPONSE_TYPE<T>
  : T extends API_FUNCTION_KEYS
  ? SPECIFIC_API_FUNCTION_RESPONSE_TYPE<T>
  : never

export type API_QUERYS_RESPONSE_TYPES = {
  [T in API_FUNCTION_KEYS | API_OBJECT_KEYS]?: API_QUERY_RESPONSE_TYPE<T>
}
