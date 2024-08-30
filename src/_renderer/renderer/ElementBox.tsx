import React, {
  CSSProperties,
  PropsWithChildren,
  MouseEvent,
  useMemo,
  useEffect,
  useRef,
} from 'react'
import { ElementType } from '../editorController/editorState'
import { Box } from '@mui/material'
import { EditorStateType } from '../editorController/editorState'
import { getStylesFromClasses } from './getStylesFromClasses'
import { useNavigate } from 'react-router-dom'
import { EditorControllerType } from '../editorController/editorControllerTypes'
import { queryAction } from './queryAction'

export type ElementBoxProps = {
  element: ElementType
  editorState: EditorStateType
  onSelectElement: (element: ElementType, isHovering: boolean) => void
  isProduction?: boolean
  isPointerProduction?: boolean
  appController: EditorControllerType['appController']
}

const sx = {
  position: 'relative',
}

export const ElementBox = (props: PropsWithChildren<ElementBoxProps>) => {
  const {
    element,
    children,
    editorState,
    isProduction,
    isPointerProduction,
    appController,
  } = props
  const navigate = useNavigate()

  const elementAttributs = editorState.attributes.filter(
    (attr) => attr.element_id === element._id
  )
  const elementAttributsDict = elementAttributs.reduce<Record<string, any>>(
    (acc, attr) => {
      return {
        ...acc,
        [attr.attr_name]: attr.attr_value,
      }
    },
    {}
  )

  const className = elementAttributsDict?.className
  const stylesFromClasses = getStylesFromClasses(
    className ?? '',
    editorState?.cssSelectors
  )

  const styles = useMemo(() => {
    const linkHoverStyles =
      element._type === 'a' && elementAttributsDict?.href
        ? { cursor: 'pointer' }
        : {}

    const styleAttributes =
      'style' in elementAttributsDict ? elementAttributsDict?.style ?? {} : {}

    const aggregatedUserStyles = {
      ...stylesFromClasses,
      ...styleAttributes,
    }
    const userOverridesEditorHoverStyles: CSSProperties = {}
    if ('borderWidth' in aggregatedUserStyles) {
      userOverridesEditorHoverStyles.borderWidth =
        aggregatedUserStyles.borderWidth + ' !important'
    }
    if ('borderStyle' in aggregatedUserStyles) {
      userOverridesEditorHoverStyles.borderStyle =
        aggregatedUserStyles.borderStyle + ' !important'
    }
    if ('borderColor' in aggregatedUserStyles) {
      userOverridesEditorHoverStyles.borderColor =
        aggregatedUserStyles.borderColor + ' !important'
    }
    if ('borderRadius' in aggregatedUserStyles) {
      userOverridesEditorHoverStyles.borderRadius =
        aggregatedUserStyles.borderRadius + ' !important'
    }

    // interesting: top=0 -> not default -> inject only if top:0, left:0 is set !! Otherwise the position is as static
    const isPositionFixed =
      !isProduction && aggregatedUserStyles?.position === 'fixed'
    const compensateX =
      isPositionFixed &&
      editorState.ui.previewMode &&
      !aggregatedUserStyles.left
        ? -364
        : isPositionFixed &&
          !editorState.ui.previewMode &&
          aggregatedUserStyles.left
        ? 364
        : 0
    const compensateY = isPositionFixed && aggregatedUserStyles.top ? 42 : 0

    //isPositionFixed && editorState.ui.previewMode && aggregatedUserStyles.top ? -42 : 0
    const compensateFixedStylesInEditor = isPositionFixed
      ? { transform: `translate(${compensateX}px, ${compensateY}px)` }
      : {}

    return {
      ...sx,
      ...linkHoverStyles,
      ...stylesFromClasses,
      ...styleAttributes,

      // ...additionalHoverStyles,
      ...userOverridesEditorHoverStyles,
      ...compensateFixedStylesInEditor,

      //   backgroundColor: "rgba(0,150,136,0.1)",
    } as CSSProperties
  }, [
    stylesFromClasses,
    isProduction,
    element,
    editorState.ui.previewMode,
    elementAttributsDict,
  ])

  // useEffect(() => {
  //   onSelectElement(element, isHovering);
  // }, [isHovering, element, onSelectElement]);

  const isOverheadHtmlElement = ['html', 'head', 'body'].includes(element._type)
  // const elementAttributs =
  //   'attributes' in element
  //     ? (element?.attributes as HTMLProps<HTMLLinkElement> & {
  //         href: string
  //       })
  //     : ({} as HTMLProps<HTMLLinkElement>)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { style, href, ...styleLessAttributes } = elementAttributsDict ?? {}

  const boxProps = useMemo(
    () => ({
      // id: isOverheadHtmlElement ? element.type + "_" + element?.id : element.id,
      component: isOverheadHtmlElement
        ? ('div' as const)
        : (element._type as any),
      key: element._id,
      ...(styleLessAttributes ?? {}),
      sx: styles,
    }),
    [element, isOverheadHtmlElement, styles, styleLessAttributes]
  )

  const linkProps = useMemo(() => {
    if (element._type === 'a') {
      return {
        onClick: (e: MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          e.preventDefault()
          // const attributes = (element as any)
          //   .attributes as HTMLProps<HTMLLinkElement> & {
          //   href: string
          // }

          const isExternalLink = !elementAttributsDict?.href?.startsWith('/')
          if (isExternalLink) {
            window.open(elementAttributsDict?.href, '_blank')
          } else {
            // const
            const href =
              elementAttributsDict?.href === '/index'
                ? '/'
                : elementAttributsDict?.href
            navigate(href ?? '')
          }
        },
      }
    }
    return {}
  }, [element, navigate, elementAttributsDict])

  const elementRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const elementEvents = editorState?.events?.filter(
      (event) => event.element_id === element._id
    )
    if (!elementEvents?.length) {
      return
    }
    const eventHandlers = elementEvents.map((event) => {
      const eventName = event.event_name.slice(2)
      const actions = editorState?.actions?.filter((act) =>
        event?.action_ids?.includes(act.action_id)
      )
      const apiEndpoints = editorState?.externalApis
        ?.map((api) =>
          api.endpoints?.map((ep) => ({ ...ep, api_id: api.external_api_id }))
        )
        .flat()
      const endpoints2 = apiEndpoints.filter((ep) =>
        actions.map((a) => a?.endpoint_id).includes(ep.endpoint_id)
      )

      const eventHandler = async (e: any) => {
        const responses: any[] = []
        for (let e = 0; e < endpoints2?.length; e++) {
          const endpoint = endpoints2[e]
          const api = editorState?.externalApis?.find(
            (api) => api.external_api_id === endpoint.api_id
          )
          const url = (api?.baseUrl ?? '') + (endpoint?.url ?? '')
          const doQueryAction = async () => {
            const action = editorState.actions.find(
              (act) => act.endpoint_id === endpoint.endpoint_id
            )
            return await queryAction(
              appController,
              action?.action_id ?? '', // should never happen -> should always have action
              endpoint?.method,
              url,
              !!endpoint?.useCookies,
              endpoint?.body,
              endpoint?.headers,
              endpoint?.params,
              endpoint?.responseType,
              endpoint?.auth.type === 'basic'
                ? {
                    username: endpoint.auth.username,
                    password: endpoint.auth.password,
                  }
                : undefined
            )
          }

          const response = await doQueryAction()
          responses.push(response)
        }
        return responses
      }
      if (!['Unmounted', 'Mounted'].includes(eventName)) {
        elementRef.current?.addEventListener(eventName, eventHandler)
      }
      if (eventName === 'Mounted') {
        eventHandler({ element_id: element._id })
      }
      return eventHandler
    })

    return () => {
      elementEvents.forEach((event, eIdx) => {
        const eventName = event.event_name.slice(2)
        if (!['Unmounted', 'Mounted'].includes(eventName)) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          elementRef.current?.removeEventListener(
            eventName,
            eventHandlers[eIdx]
          )
        }
        if (eventName === 'Unmounted') {
          eventHandlers[eIdx]({ element_id: element._id })
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState?.events])

  const imageFile = useMemo(
    () =>
      element?._type === 'img' && elementAttributsDict?.src
        ? (editorState.assets.images.find(
            (img) => img._id === elementAttributsDict?.src && img.image
          )?.image as unknown as File)
        : undefined,
    [element, elementAttributsDict, editorState.assets.images]
  )
  const prodImageAsset = editorState.assets.images.find(
    (img) => img.src === elementAttributsDict?.src
  )
  const prodFilenameExtension = prodImageAsset?.fileName?.split('.')?.pop()
  const imageSrc =
    isProduction && elementAttributsDict?.src
      ? `/assets/images/${elementAttributsDict?.src}.${prodFilenameExtension}`
      : imageFile
      ? URL.createObjectURL(imageFile)
      : undefined

  return ['br', 'hr', 'img'].includes(element?._type) ? (
    <Box {...boxProps} {...linkProps} src={imageSrc} ref={elementRef} />
  ) : (
    <Box
      {...linkProps}
      {...boxProps}
      ref={elementRef}
      // {...uiEditorHandlers}
    >
      {/* label */}
      {!(isProduction || isPointerProduction) &&
        ((
          <Box
            sx={{
              display: 'none',
              position: 'absolute',
              top: 0,
              right: 0,
              border: '1px solid rgba(0,150,136,0.5)',
              borderRadius: '1px',
              color: 'text.primary',
            }}
          >
            {element._type}
          </Box>
        ) as any)}

      {('_content' in element ? element?._content : children) || children}
    </Box>
  )
}
