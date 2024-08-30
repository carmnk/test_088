import { EntityModelType } from '../EntityModel/entityDataModel'

export type GithubUserType = {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string // ?
  url: string
  html_url: string
  followers_url: string
  type: string
  site_admin: boolean
  name: string | null
  company: string | null
  location: string | null
  email: string | null
  created_at: string // Date ?
  updated_at: string
}

export type ServerData = {
  bundleData: {
    loading: boolean
    link: string
    blob: Blob | null
  }
  loginForm: {
    email: string
    password: string
    isLoggedIn?: boolean // ?
  }
  user: GithubUserType | null
  repos: any[]
  loading: boolean
  entityModel: EntityModelType
}

export const defaultServerData: ServerData = {
  bundleData: {
    loading: false,
    link: '',
    blob: null as Blob | null,
  },
  loginForm: {
    email: 'cm@cm.mt',
    password: 'password',
    isLoggedIn: false,
  },
  loading: false,
  user: null as GithubUserType | null,
  repos: [] as any[],
  entityModel: {
    _entities: [],
    _entity_fields: [],
    _entity_values: [],
    _entity_lists: [],
    _entity_list_fields: [],
    _entity_joinings: [],
  },
}
