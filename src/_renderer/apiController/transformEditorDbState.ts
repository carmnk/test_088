import { ExtendedTheme } from '../muiTheme'
import {
  EditorStateType,
  ElementKeyType,
  defaultEditorState,
} from '../editorController/editorState'
import { isComponentType } from '../renderer/utils'
import { reloadSerializedThemes } from './transformEditorStateTheme'
import { EditorStateDbDataType } from './editorDbStateType'

export const transformEditorStateFromPayload = (
  data: EditorStateDbDataType,
  currentEditorState = defaultEditorState(),
  componentsIn: any[],
  disableThemeReload = false
): EditorStateType => {
  const {
    selected_css_selector,
    selected_element,
    selected_font,
    selected_image,
    selected_page,
    selected_server_setting,
    selected_state,
    selected_entity,
    selected_entity_element,
    active_tab,
    active_backend_tab,
    pointer_mode,
    default_theme: defaultTheme,
    ...project
  } = data?.project ?? {}

  const ui = {
    ...(currentEditorState?.ui ?? {}),
    selected: {
      ...(currentEditorState?.ui?.selected ?? {}),
      cssSelector: selected_css_selector ?? null,
      element: selected_element ?? null,
      font: selected_font ?? null,
      image: selected_image ?? null,
      page: selected_page ?? null,
      serverSetting: selected_server_setting ?? 'ssl',
      state: selected_state ?? null,
      entity: selected_entity ?? null,
      entityElement: selected_entity_element ?? 'fields',
    },
    navigationMenu: {
      ...(currentEditorState?.ui?.navigationMenu ?? {}),
      activeTab: active_tab as any,
      activeBackendTab: active_backend_tab as any,
    },
    pointerMode: pointer_mode as any,
  }

  const newImageAssets = {
    images: data?.images?.map?.((image) => ({
      ...((currentEditorState?.assets?.images?.find?.(
        (img) => img._id === image.asset_id
      ) ?? {}) as any),
      _id: image.asset_id,
      fileName: image.asset_filename,
      created_datetime: (image as any).created_datetime,
      edited_datetime: (image as any).edited_datetime,
      // src:
    })),
  }
  const allElements =
    data?.elements?.map?.((el) => ({
      ...(isComponentType(el.element_type as ElementKeyType)
        ? componentsIn.find((bc) => bc.type === el.element_type)
        : {}),
      _id: el?.viewport
        ? el.viewport_ref_element_id ?? el.element_id
        : el.element_id,
      _userID: el.element_html_id,
      _parentId: el.parent_id,
      _content: el.content as any,
      _imageSrcId: el.image_src_id ?? undefined,
      _type: el.element_type as any,
      _disableDelete: el.element_disable_delete ?? undefined,
      _page: el.element_page as string,
      viewport: el.viewport,
      template_id: el.template_id,
      // props: data?.props
      //   ?.filter?.((prop) => prop.element_id === el.element_id)
      //   ?.reduce((acc, prop) => {
      //     const value =
      //       [
      //         'items',
      //         'sx',
      //         'slotProps',
      //         'columns',
      //         'data',
      //         'filters',
      //         'fields',
      //         'onClick',
      //       ].includes(prop.prop_name) ||
      //       (['children'].includes(prop.prop_name) &&
      //         el.element_type !== 'Typography')
      //         ? JSON.parse(prop.prop_value)
      //         : prop.prop_value === 'null'
      //         ? null
      //         : prop.prop_value === 'true'
      //         ? true
      //         : prop.prop_value === 'false'
      //         ? false
      //         : prop.prop_value
      //     return {
      //       ...acc,
      //       [prop.prop_name]: value,
      //       element_id: el?.viewport
      //         ? el.viewport_ref_element_id ?? el.element_id
      //         : el.element_id,
      //     }
      //   }, {}),
      // attributes: data?.attributes
      //   ?.filter?.((attr) => attr.element_id === el.element_id)
      //   ?.reduce((acc, attr) => {
      //     const value =
      //       attr.attr_name === 'style' && typeof attr.attr_value === 'string'
      //         ? JSON.parse(attr.attr_value)
      //         : attr.attr_value
      //     return {
      //       ...acc,
      //       [attr.attr_name]: value,
      //       element_id: el?.viewport
      //         ? el.viewport_ref_element_id ?? el.element_id
      //         : el.element_id,
      //     }
      //   }, {}),
      viewport_ref_element_id: !el?.viewport
        ? el?.element_id
        : el.viewport_ref_element_id,
      viewport_db_element_id: el?.viewport ? el.element_id : null,
    })) ?? []
  const baseViewportElements = allElements.filter((el) => !el?.viewport)

  // const elementsOtherViewports =

  const elements = [...baseViewportElements]
  const alternativeElements = allElements
    .filter((el) => el?.viewport)
    ?.map((el) => ({
      ...el,
      _id: (el.viewport_ref_element_id as string) ?? el._id,
      viewport_ref_element_id: el._id,
    }))
  const alternativeViewports = {
    sm: alternativeElements.filter((el) => el?.viewport === 'sm'),
    md: alternativeElements.filter((el) => el?.viewport === 'md'),
    lg: alternativeElements.filter((el) => el?.viewport === 'lg'),
    xl: alternativeElements.filter((el) => el?.viewport === 'xl'),
  }

  const themes = disableThemeReload
    ? (data.themes as any)
    : reloadSerializedThemes(data.themes as any, currentEditorState?.themes)

  const externalApis: EditorStateType['externalApis'] =
    data?.externalApis?.map((api) => {
      return {
        external_api_id: api.external_api_id,
        name: api.name,
        auth:
          api.auth_type === 'basic'
            ? {
                type: api.auth_type,
                username: api.auth_basic_username,
                password: api.auth_basic_password,
              }
            : api.auth_type === 'bearer'
            ? { type: api.auth_type, token: api.auth_bearer_token }
            : { type: api.auth_type },
        baseUrl: api.base_url,
        useCookies: api.use_cookies,
        project_id: api.project_id,
        endpoints: data?.endpoints
          .filter((ep) => ep.api_id === api.external_api_id)
          ?.map((ep) => {
            return {
              project_id: ep.project_id,
              endpoint_id: ep.endpoint_id,
              name: ep.name,
              url: ep.url,
              method: ep.method,
              auth:
                ep.auth_type === 'basic'
                  ? {
                      type: ep.auth_type,
                      username: ep.auth_basic_username as string,
                      password: ep.auth_basic_password as string,
                    }
                  : ep.auth_type === 'bearer'
                  ? {
                      type: ep.auth_type,
                      token: ep.auth_bearer_token as string,
                    }
                  : { type: ep.auth_type },
              responseType: ep.response_type,
              useCookies: ep.use_cookies,
              headers: data?.headers.filter(
                (header) => header.endpoint_id === ep.endpoint_id
              ),
              params: data?.params.filter(
                (param) => param.endpoint_id === ep.endpoint_id
              ),
              body: data?.bodyParams.filter(
                (param) => param.endpoint_id === ep.endpoint_id
              ),
            }
          }),
        headers: data?.headers.filter(
          (header) => header.api_id === api.external_api_id
        ),
      }
    }) ?? []

  console.log('COMPARE - IN :', data.elements)
  console.log('COMPARE - OUT :', elements, alternativeViewports)
  return {
    ...currentEditorState,
    properties:
      data?.properties?.map((prop) => {
        const element = elements.find((el) => el._id === prop.element_id)
        const value =
          [
            'items',
            'sx',
            'slotProps',
            'columns',
            'data',
            'filters',
            'fields',
            'onClick',
          ].includes(prop.prop_name) ||
          (['children'].includes(prop.prop_name) &&
            element?.element_type !== 'Typography')
            ? (() => {
                try {
                  return JSON.parse(prop.prop_value)
                } catch (e) {
                  // console.error(e, prop)
                  return prop.prop_value
                }
              })()
            : prop.prop_value === 'null'
            ? null
            : prop.prop_value === 'true'
            ? true
            : prop.prop_value === 'false'
            ? false
            : prop.prop_value
        return { ...prop, prop_value: value }
      }) ?? [],
    attributes:
      data?.attributes?.map((attr) => {
        const value = ['style'].includes(attr.attr_name)
          ? (() => {
              try {
                return JSON.parse(attr.attr_value)
              } catch (e) {
                // console.error(e, attr)
                return attr.attr_value
              }
            })()
          : attr.attr_value === 'null'
          ? null
          : attr.attr_value === 'true'
          ? true
          : attr.attr_value === 'false'
          ? false
          : attr.attr_value
        return { ...attr, attr_value: value }
      }) ?? [],
    defaultTheme: defaultTheme as any,
    alternativeViewports,
    project,
    elements,
    cssSelectors:
      (data?.cssSelectors?.map?.((cssSelector) => ({
        ...cssSelector,
        _id: cssSelector.css_selector_id,
        _userId: cssSelector.css_selector_name,
      })) as any[]) ?? [],
    ui,
    assets: newImageAssets,
    themes,
    theme: themes.find(
      (theme: ExtendedTheme) => theme.palette.mode === defaultTheme
    ),
    externalApis,
    events:
      data?.events?.sort((a, b) => (a.event_name > b.event_name ? 1 : -1)) ??
      [],
    actions:
      data?.actions?.sort((a, b) => (a.action_id > b.action_id ? 1 : -1)) ?? [],
    templateComponents: data?.templates ?? [],
  }
}
