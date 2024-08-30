import { EditorStateType } from '../editorController/editorState'
import { v4 as uuid } from 'uuid'
import { transformEditorStateTheme } from './transformEditorStateTheme'
import {
  EditorStateDbDataType,
  EndpointDb,
  ExternalApiDb,
} from './editorDbStateType'

export const transformEditorStateToPayload = (
  payload: EditorStateType,
  // includeBase64Images = false
  disableLogging = false
): EditorStateDbDataType | null => {
  const projectIn = payload?.project ?? {}
  const project_id = projectIn.project_id
  if (!project_id) {
    alert('project_id is missing')
    console.warn(
      'project_id is missing:',
      projectIn,
      `(projectIn)`,
      payload,
      `(payload)`
    )
    return null
  }
  const uiIn = payload.ui as Omit<EditorStateType['ui'], 'detailsMenu'>
  const {
    page = null,
    cssSelector = null,
    image = null,
    state = null,
    element = null,
    font = null,
    serverSetting = null,
    entity = null,
    entityElement = null,
  } = uiIn.selected
  // save with project
  const uiOut = {
    selected_page: page,
    selected_server_setting: serverSetting,
    selected_css_selector: cssSelector,
    selected_image: image,
    selected_state: state,
    selected_element: element,
    selected_font: font,
    active_tab: uiIn?.navigationMenu?.activeTab ?? null,
    active_backend_tab: uiIn?.navigationMenu?.activeBackendTab ?? null,
    pointer_mode: uiIn?.pointerMode ?? null,
    selected_entity: entity,
    selected_entity_element: entityElement ?? null,
  }
  const projectOut = {
    ...projectIn,
    ...uiOut,
    default_theme: payload.defaultTheme,
  }
  // insert project and retrieve id

  const elementsInBaseViewport =
    payload?.elements?.map((el) => ({ ...el, viewport: null })) || []

  const alternativeVewportKeys = Object.keys(
    payload?.alternativeViewports || {}
  )
  const elementsInOtherViewports = alternativeVewportKeys
    .map(
      (viewportKey) =>
        payload?.alternativeViewports?.[
          viewportKey as keyof typeof payload.alternativeViewports
        ]?.map((el) => ({ ...el, viewport: viewportKey })) || []
    )
    .flat()
  const elementsIn = [...elementsInBaseViewport, ...elementsInOtherViewports]

  const elementsOut = elementsIn.map((element) => {
    if (!disableLogging) {
      // console.log(
      //   'CHANGED STATE KEYS 2',
      //   element,
      //   element?.viewport,
      //   (element as any).viewport_ref_element_id === element._id,
      //   element.viewport_db_element_id,
      //   element?.viewport &&
      //     element.viewport_ref_element_id === element._id &&
      //     !element.viewport_db_element_id
      // )
      if (
        element?.viewport &&
        element.viewport_ref_element_id === element._id &&
        !element.viewport_db_element_id
      )
        console.warn('NEW VIEWPORT SPECIFIC ID', element)
    }
    return {
      element_id: element?.viewport
        ? element.viewport_ref_element_id === element._id
          ? element.viewport_db_element_id || uuid()
          : element._id
        : element._id,
      element_html_id: element?._userID ?? null,
      project_id,
      // _user,
      parent_id: element?._parentId ?? null,
      content: element?._content ?? null,
      image_src_id: element?._imageSrcId ?? null,
      element_type: element?._type ?? null,
      element_disable_delete: element?._disableDelete ?? null,
      element_page: element?._page ?? null,
      viewport: element?.viewport ?? null,
      viewport_ref_element_id: (element as any).viewport_ref_element_id ?? null,
      template_id: element?.template_id ?? null,
    }
  })
  // const elementsout2 = elementsOut.map((el) => ({
  //   ...el,
  //   hasSameIds: el.viewport_ref_element_id === el.element_id,
  // }))

  // if (!disableLogging) {
  //   console.log('ELEMENTS', elementsIn, elementsOut)
  // }

  // stringify props and attributes if value is objectish
  // const props =
  //   elementsIn
  //     ?.map?.((el, eIdx) =>
  //       'props' in el && el.props
  //         ? Object.keys(el.props)
  //             .map((key) => {
  //               const elementOut = elementsOut[eIdx]
  //               const prop_value_raw = (el.props as any)?.[key]
  //               const prop_value = ['function', 'object'].includes(
  //                 typeof prop_value_raw
  //               )
  //                 ? JSON.stringify(prop_value_raw)
  //                 : prop_value_raw
  //               const newId = uuid()
  //               return {
  //                 prop_id: newId,
  //                 element_id: el?.viewport ? elementOut?.element_id : el._id,
  //                 prop_name: key,
  //                 prop_value,
  //                 project_id,
  //                 // _user,
  //               }
  //             })
  //             ?.filter(
  //               (prop) =>
  //                 (prop.prop_value ||
  //                   prop.prop_value === false ||
  //                   (prop as any).prop_name === 0) &&
  //                 prop.prop_name
  //             )
  //         : []
  //     )
  //     ?.flat() ?? []

  const properties =
    payload?.properties?.map((prop) => {
      const prop_value = ['function', 'object'].includes(typeof prop.prop_value)
        ? JSON.stringify(prop.prop_value)
        : prop.prop_value
      return { ...prop, prop_value }
    }) || []

  const attributes =
    payload?.attributes?.map((attr) => {
      console.log('attr', attr)
      const attr_value = ['function', 'object'].includes(typeof attr.attr_value)
        ? JSON.stringify(attr.attr_value)
        : // :
          // typeof attr.attr_value === 'string' &&
          //   attr.attr_value.startsWith('blob:')
          // ? attr.attr_value.slice(attr.attr_value.lastIndexOf('/') + 1)
          attr.attr_value
      return { ...attr, attr_value }
    }) || []

  // const attributes =
  //   elementsIn
  //     ?.map?.((el, eIdx) =>
  //       'attributes' in el && el.attributes
  //         ? Object.keys(el.attributes)
  //             .map((key) => {
  //               const elementOut = elementsOut[eIdx]
  //               const attr_value_raw = (el.attributes as any)?.[key]
  //               const matchingImageSrcSerializes =
  //                 (key === 'src' &&
  //                   typeof attr_value_raw === 'string' &&
  //                   payload.assets.images?.find(
  //                     (img) => img.src === attr_value_raw
  //                   )?._id) ||
  //                 null
  //               const attr_value = matchingImageSrcSerializes
  //                 ? matchingImageSrcSerializes
  //                 : ['function', 'object'].includes(typeof attr_value_raw)
  //                 ? JSON.stringify(attr_value_raw)
  //                 : attr_value_raw

  //               return {
  //                 attr_id: uuid(),
  //                 element_id: el?.viewport ? elementOut?.element_id : el._id,
  //                 attr_name: key,
  //                 attr_value,
  //                 project_id,
  //                 // _user,
  //               }
  //             })
  //             ?.filter((attr) => attr.attr_value && attr.attr_name)
  //         : []
  //     )
  //     ?.flat() ?? []

  const cssSelectorsIn = payload?.cssSelectors || []
  const cssSelectorsOut = cssSelectorsIn.map((cssSelector) => {
    return {
      css_selector_id: cssSelector._id,
      css_selector_name: cssSelector?.css_selector_name ?? [],
      project_id,
      // _user,
      //   selector_page?: string
      //   selector_type?: string
    }
  })

  // seperate handling! -> must be multipart form data!!!!
  const images = payload.assets.images?.map((image) => {
    return {
      asset_id: image._id,
      // image: typeof Image
      // src: string
      project_id,
      asset_filename: image.fileName,
    }
  })
  const imageFiles = payload.assets.images
    ?.filter((img) => (img as any)._upload)
    ?.map((image) => {
      return {
        asset_id: image._id,
        image: image.image as any,
        // image: includeBase64Images && image.image
        //   ? toBase64(image.image as any)
        //   : (image.image as any),
        // src: string
        //   fileName: image.fileName,
      }
    })

  const themes: EditorStateDbDataType['themes'] = transformEditorStateTheme(
    payload.themes,
    project_id
  )

  const externalApis: ExternalApiDb[] = payload.externalApis.map((api) => {
    return {
      external_api_id: api.external_api_id,
      name: api.name,
      project_id,
      base_url: api.baseUrl,
      auth_type: api.auth.type,
      auth_basic_username: (api.auth as any).username,
      auth_basic_password: (api.auth as any).password,
      auth_bearer_token: (api.auth as any).token,
      use_cookies: api.useCookies,
    }
  })
  const endpoints: EndpointDb[] = payload.externalApis
    .map((api) => {
      return api.endpoints.map((endpoint) => {
        return {
          endpoint_id: endpoint.endpoint_id,
          name: endpoint.name,
          url: endpoint.url,
          method: endpoint.method,
          response_type: endpoint.responseType,
          use_cookies: endpoint.useCookies,
          auth_type: endpoint?.auth?.type,
          auth_basic_username:
            endpoint?.auth?.type === 'basic' ? endpoint?.auth?.username : null,
          auth_basic_password:
            endpoint?.auth?.type === 'basic' ? endpoint?.auth?.password : null,
          auth_bearer_token:
            endpoint?.auth?.type === 'bearer' ? endpoint.auth.token : null,
          api_id: api.external_api_id,
          project_id,
        }
      })
    })
    .flat()

  const headers = payload.externalApis
    .map((api) => {
      const apiHeaders = api?.headers?.map?.((header) => {
        return {
          project_id,
          header_id: uuid(),
          key: header.key,
          value: header.value,
          api_id: api.external_api_id,
          endpoint_id: null,
        }
      })
      const endpointHeaders = api?.endpoints
        ?.map(
          (ep) =>
            ep?.headers?.map?.((header) => {
              return {
                project_id,
                header_id: uuid(),
                key: header.key,
                value: header.value,
                api_id: api.external_api_id,
                endpoint_id: ep.endpoint_id,
              }
            }) || []
        )
        .flat()
      return [...(apiHeaders ?? []), ...(endpointHeaders ?? [])]
    })
    .flat()
  const params = payload.externalApis
    .map((api) =>
      api.endpoints
        .map((ep) =>
          ep.params.map((param) => {
            return {
              param_id: uuid(),
              key: param.key,
              value: param.value,
              endpoint_id: ep.endpoint_id,
              project_id,
            }
          })
        )
        .flat()
    )
    .flat()

  const bodyParams = payload.externalApis
    .map((api) =>
      api.endpoints
        .map(
          (ep) =>
            ep.body?.map?.((param) => {
              return {
                body_param_id: uuid(),
                key: param.key,
                value: param.value,
                endpoint_id: ep.endpoint_id,
                project_id,
              }
            }) || []
        )
        .flat()
    )
    .flat()

  // headers: { key: string; value: string }[] // -> subtable
  // endpoints: Endpoint[]

  return {
    project: projectOut as any,
    elements: elementsOut,
    // props: properties,
    attributes,
    cssSelectors: cssSelectorsOut as any,
    images,
    imageFiles,
    themes,
    externalApis,
    endpoints,
    headers,
    params,
    bodyParams,
    events:
      payload.events?.sort((a, b) => (a.event_name > b.event_name ? 1 : -1)) ??
      [],
    actions:
      payload.actions?.sort((a, b) => (a.action_id > b.action_id ? 1 : -1)) ??
      [],
    properties,
    templates: payload.templateComponents,
  }
}
