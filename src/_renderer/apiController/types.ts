import { ProjectType } from '../editorController/editorState'
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
  }[]
  props: {
    element_id: string
    prop_name: string
    prop_value: string
    project_id: string
  }[]
  attributes: {
    element_id: string
    attr_name: string
    attr_value: string
    project_id: string
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
}
