import { EditorStateType, ProjectType } from '../editorController/editorState'
// export type EditorStatePayloadType = Omit<
//   EditorStateType,
//   'fonts' | 'theme' | 'themes'
// > & {
//   project: ProjectType
// }

export type SerializedThemeType = {
  id: string
  project_id: string
  name: string
  // palette
  primary_main: string
  primary_light: string
  primary_dark: string
  primary_contrastText: string
  secondary_main: string
  secondary_light: string
  secondary_dark: string
  secondary_contrastText: string
  error_main: string
  error_light: string
  error_dark: string
  error_contrastText: string
  warning_main: string
  warning_light: string
  warning_dark: string
  warning_contrastText: string
  info_main: string
  info_light: string
  info_dark: string
  info_contrastText: string
  success_main: string
  success_light: string
  success_dark: string
  success_contrastText: string
  text_primary: string
  text_secondary: string
  text_disabled: string
  background_default: string
  background_paper: string
  action_active: string
  action_hover: string
  action_selected: string
  action_disabled: string
  action_disabled_background: string
  action_focus: string
  mode: string
}

export type EditorStateDbDataType = {
  project: ProjectType
  elements: {
    element_id: string
    element_html_id: string | null
    project_id: string
    parent_id: string | null
    content: string | null
    image_src_id: string | null
    element_type: string
    element_disable_delete: boolean | null
    element_page: string | null
    viewport: string | null
    viewport_ref_element_id: string | null
    template_id: string | null
  }[]
  // props: {
  //   element_id: string | null
  //   template_id: string | null
  //   prop_name: string
  //   prop_value: string
  //   project_id: string
  // }[]
  attributes: {
    element_id: string | null
    template_id: string | null
    attr_name: string
    attr_value: string
    project_id: string
    attr_id: string
  }[]
  cssSelectors: {
    css_selector_id: string
    css_selector_name: string
    project_id: string
  }[]
  images: {
    asset_id: string
    // image: typeof Image
    // src: string
    asset_filename: string
    project_id: string
  }[]
  imageFiles?: {
    asset_id: string
    image: File
    // src: string
    // fileName: string
  }[]
  themes: SerializedThemeType[]

  externalApis: ExternalApiDb[]
  endpoints: EndpointDb[]
  headers: HeaderDb[]
  params: ParamDb[]
  bodyParams: BodyParamDb[]
  events: EditorStateType['events']
  actions: EditorStateType['actions']
  properties: {
    element_id: string | null
    template_id: string | null
    prop_name: string
    prop_value: string
    project_id: string
    prop_id: string
  }[]
  templates: {
    template_id: string
    project_id: string
    template_name: string
    content: string | null
    type: string
    is_default: boolean
  }[]
}

export type EndpointDb = {
  endpoint_id: string
  name: string
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  response_type: 'json' | 'text' | 'blob' //XXX
  use_cookies: boolean //XXX
  auth_type: 'basic' | 'bearer' | 'none'
  auth_basic_username: string | null
  auth_basic_password: string | null
  auth_bearer_token: string | null
  api_id: string
  project_id: string
  // headers: { key: string; value: string }[] // -> subtable
  // params: { key: string; value: string }[] // -> subtable
  // body: { key: string; value: any }[] // -> subtable
}

export type HeaderDb = {
  header_id: string
  key: string
  value: string
  api_id: string | null
  endpoint_id: string | null
  project_id: string
}

export type ParamDb = {
  param_id: string
  key: string
  value: string
  endpoint_id: string
  project_id: string
}
export type BodyParamDb = {
  body_param_id: string
  key: string
  value: string
  endpoint_id: string
  project_id: string
}

export type ExternalApiDb = {
  external_api_id: string
  name: string
  base_url: string
  auth_type: 'basic' | 'bearer' | 'none'
  auth_basic_username: string
  auth_basic_password: string
  auth_bearer_token: string

  // headers: { key: string; value: string }[] // -> subtable
  use_cookies: boolean //XXX
  project_id: string
  // endpoints: Endpoint[]
}
