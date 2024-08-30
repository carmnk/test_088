import { ElementType } from '../editorController/editorState'
import { ElementBox } from './ElementBox'
import { AppBar, Box, Paper, Theme } from '@mui/material'
import { EditorControllerType } from '../editorController/editorControllerTypes'
import React from 'react'
import { PropertyType } from '../editorComponents/schemaTypes'
import { TableProps } from '@cmk/fe_utils'
import { RootElementOverlay } from './RootElementOverlay'
import { isComponentType } from './utils'
import { queryAction } from './queryAction'
import { replaceTemplateInString } from './templates'

export const isStringLowerCase = (str: string): boolean => {
  return str === str.toLowerCase()
}

export const renderHtmlElements = (
  elements: ElementType[],
  editorController: EditorControllerType,
  onSelectElement: (element: ElementType, isHovering: boolean) => void,
  tableUis: Record<
    string,
    {
      onSetFilters: TableProps['onSetFilters']
      filters: TableProps['filters']
    }
  >,
  theme: Theme,
  isProduction?: boolean,
  icons?: { [key: string]: string },
  parentId?: string,
  isPointerProduction?: boolean
): React.ReactNode => {
  const {
    editorState,
    actions,
    appController,
    currentViewportElements,
    COMPONENT_MODELS,
  } = editorController

  const elementsAdj = (
    !parentId
      ? elements?.filter((el) => !el._parentId)
      : elements?.filter((el) => el._parentId === parentId)
  )?.filter((el) => el._page === editorState.ui.selected.page)

  const rawElements = elementsAdj.map((element) => {
    const typeFirstLetter = element._type.slice(0, 1)
    const isHtmlElement = isStringLowerCase(typeFirstLetter)
    const elementProps = editorState.properties?.filter(
      (prop) => prop.element_id === element._id
    )
    const templateProps = editorState.properties?.filter(
      (prop) => prop.template_id === element.template_id
    )
    const allElementProps = [...(elementProps ?? []), ...(templateProps ?? [])]

    const getPropByName = (key: string) =>
      allElementProps?.find((prop) => prop.prop_name === key)?.prop_value

    const schemaProps = (element as any)?.schema?.properties ?? {}
    const elementIconKeys = isHtmlElement
      ? []
      : Object.keys(schemaProps)?.filter(
          (key) => schemaProps[key]?.type === PropertyType.icon
        )
    const elementArrayKeys = isHtmlElement
      ? []
      : Object.keys(schemaProps)?.filter((key) => {
          const itemsProps = (schemaProps?.[key] as any)?.items?.[0]?.properties
          return (
            schemaProps[key]?.type === PropertyType.Array &&
            Object.keys(itemsProps)?.filter?.(
              (key) => itemsProps[key]?.type === PropertyType.icon
            )
          )
        })
    const elementArrayIconInjectionDict = elementArrayKeys
      .map((key) => {
        const itemsProps = (schemaProps?.[key] as any)?.items?.[0]?.properties
        return Object.keys(itemsProps)
          ?.filter((key) => itemsProps[key]?.type === PropertyType.icon)
          ?.map((itemKey) => ({ key, itemKey }))
      })
      .flat()
      ?.reduce((acc, it) => {
        return {
          ...acc,
          [it.key]: getPropByName(it.key)?.map?.((item: any) => ({
            ...item,
            [it.itemKey]: icons?.[item[it.itemKey]],
          })),
        }
      }, {})

    // e.g. {...., icon: mdiPencil, ... }

    const injectedIconsDict = elementIconKeys?.reduce(
      (acc, key) => ({
        ...acc,
        [key]: icons?.[getPropByName(key)],
      }),
      {}
    )

    const baseComponent = COMPONENT_MODELS?.find(
      (com) => com.type === element?._type
    )
    const CurrentComponent =
      baseComponent &&
      'component' in baseComponent &&
      (baseComponent.component as React.ComponentType<any>)

    const elementPropsObject = allElementProps.reduce((acc, cur) => {
      const key = cur.prop_name
      const keyValue = getPropByName(key)
      // currently only data
      const regex = /{(_data|form)\.[^}]*}/g
      const matches = keyValue?.match?.(regex)
      const keyValueAdj = matches
        ? replaceTemplateInString(
            keyValue,
            editorController.appController.state
          )
        : keyValue
      return {
        ...acc,
        [key]: keyValueAdj,
      }
    }, {})
    // const elementPropsAdj = elementProps

    const regex = /{(_data|form)\.[^}]*}/g
    const matches = element._content?.match?.(regex)
    const content = matches
      ? replaceTemplateInString(
          element._content ?? '',
          editorController.appController.state
        )
      : element._content
    const elementAdj = {
      ...element,
      content,
      props: {
        ...(elementPropsObject ?? {}),
        // ...iconInjection,
        // ...endIconInjection,
        ...injectedIconsDict,

        ...elementArrayIconInjectionDict,
      },
    }

    const navValueState = (appController as any)?.state?.[element?._id] ?? {}
    const onTabChange = (tabValue: string) => {
      appController.actions.updateProperty(element?._id, tabValue)
    }

    const elementChildren =
      currentViewportElements?.filter(
        (el) => el._parentId === element._id && element._id
      ) ?? []
    const tabChildren =
      element?._type === ('NavContainer' as any)
        ? (() => {
            const sourceControlElementId = getPropByName('navigationElementId')
            // ?.navigationElementId

            if (!sourceControlElementId) return []
            const activeTab = appController?.state?.[sourceControlElementId]
            const activeId = getPropByName('items')?.find(
              (item: any) => item.value === activeTab
            )?.childId
            const activeChild = elementChildren?.find?.(
              (child) => child._id === activeId
            )
            const children = activeChild ? [activeChild] : []
            return children
          })()
        : []

    const renderedElementChildren =
      !!elementChildren?.length &&
      renderHtmlElements(
        elementChildren,
        editorController,
        onSelectElement,
        tableUis,
        theme,
        isProduction,
        icons,
        element._id,
        isPointerProduction
      )

    const TabChildren =
      !!tabChildren?.length &&
      renderHtmlElements(
        tabChildren,
        editorController,
        onSelectElement,
        tableUis,
        theme,
        isProduction,
        icons,
        element._id,
        isPointerProduction
      )

    const clientFilters = tableUis?.[element._id]?.filters ?? []
    const clientFiltersExSorting = clientFilters?.filter(
      (f: any) => f.filterKey !== 'sorting'
    )
    const clientFilterSorting = clientFilters?.filter(
      (f: any) => f.filterKey === 'sorting'
    )?.[0]?.value
    const [clientFilterKey, clientFilterDirection] =
      clientFilterSorting?.split?.(',') ?? []

    const clientFilteredTableData =
      getPropByName('data')?.filter?.((d: any) =>
        clientFiltersExSorting?.length
          ? clientFilters.some((f: any) => f.value === d[f.filterKey])
          : true
      ) ?? []
    const clientSortedFilteredTableData = clientFilterKey
      ? clientFilteredTableData?.sort?.((a: any, b: any) => {
          const sortKey = clientFilterKey
          return a?.[sortKey] > b?.[sortKey]
            ? clientFilterDirection === 'asc'
              ? 1
              : -1
            : b?.[sortKey] > a?.[sortKey]
            ? clientFilterDirection === 'asc'
              ? -1
              : 1
            : 0
        })
      : clientFilteredTableData

    const rootElementOverlayProps = {
      editorController,
      element: element,
      onSelectElement: editorController.actions.ui.selectElement,
      editorState,
      actions: editorController.actions,
      onIsHoveringChange: editorController.actions.ui.selectHoveredElement,
      isProduction,
    }
    const componentEvents = (elementAdj as any)
      ?.formGen?.(editorController, appController)
      ?.fields?.filter((field: any) => field._prop_type === 'eventHandler')
    const componentEventNames = componentEvents?.map((ev: any) => ev.name)
    const eventHandlerProps = componentEventNames?.reduce(
      (acc: any, currentEventName: string) => {
        const eventProps = getPropByName(currentEventName)
        if (!eventProps) return acc
        return {
          ...acc,
          [currentEventName]: () => {
            const clickActionIds: string[] = eventProps
            const clickActions = editorState.actions.filter((act) =>
              clickActionIds.includes(act.action_id)
            )
            for (let c = 0; c < clickActions.length; c++) {
              const clickAction = clickActions[c]
              const endpointId = clickAction.endpoint_id
              const endpoint = editorState.externalApis
                .map((api) =>
                  api.endpoints.map((ep) => ({
                    ...ep,
                    api_id: api.external_api_id,
                  }))
                )
                .flat()
                .find((ep) => ep.endpoint_id === endpointId)
              const api = editorState.externalApis.find(
                (api) => api.external_api_id === endpoint?.api_id
              )
              const url = (api?.baseUrl ?? '') + (endpoint?.url ?? '')
              const action = editorState.actions.find(
                (act) => act.endpoint_id === endpoint?.endpoint_id
              )
              queryAction(
                appController,
                action?.action_id ?? '', // should never happen -> should always have action
                endpoint?.method,
                url,
                !!endpoint?.useCookies,
                {},
                endpoint?.headers,
                endpoint?.params,
                endpoint?.responseType
              )
            }
          },
        }
      },
      {}
    )

    // if (element._type === 'Button') {
    //   const propFields = (elementAdj as any)
    //     ?.formGen?.(editorController, appController)
    //     ?.fields?.filter((field: any) => field._prop_type === 'eventHandler')
    // }

    const elementAdj2 = {
      ...elementAdj,
      _content: content,
    }
    return isHtmlElement ? (
      <ElementBox
        element={elementAdj2}
        onSelectElement={onSelectElement}
        editorState={editorState}
        key={element._id}
        isProduction={isProduction || isPointerProduction}
        appController={appController}
      >
        <RootElementOverlay {...rootElementOverlayProps} />
        {renderedElementChildren}
      </ElementBox>
    ) : // components
    isComponentType(element._type) ? (
      ['Button', 'Chip', 'Typography'].includes(element?._type) &&
      CurrentComponent ? (
        <CurrentComponent
          key={element._id}
          {...(elementPropsObject ?? {})}
          {...injectedIconsDict}
          {...elementArrayIconInjectionDict}
          rootInjection={<RootElementOverlay {...rootElementOverlayProps} />}
          sx={
            !isProduction
              ? {
                  ...((elementPropsObject as any)?.sx ?? {}),
                  position: 'relative',
                }
              : (elementPropsObject as any)?.sx
          }
          // onClick={
          //   'onClick' in elementAdj.props
          //     ? () => {
          //         const clickActionIds: string[] = elementAdj.props.onClick
          //         const clickActions = editorState.actions.filter((act) =>
          //           clickActionIds.includes(act.action_id)
          //         )
          //         for (let c = 0; c < clickActions.length; c++) {
          //           const clickAction = clickActions[c]
          //           const endpointId = clickAction.endpoint_id
          //           const endpoint = editorState.externalApis
          //             .map((api) =>
          //               api.endpoints.map((ep) => ({
          //                 ...ep,
          //                 api_id: api.external_api_id,
          //               }))
          //             )
          //             .flat()
          //             .find((ep) => ep.endpoint_id === endpointId)
          //           const api = editorState.externalApis.find(
          //             (api) => api.external_api_id === endpoint?.api_id
          //           )
          //           const url = (api?.baseUrl ?? '') + (endpoint?.url ?? '')
          //           queryAction(
          //             endpoint?.method,
          //             url,
          //             !!endpoint?.useCookies,
          //             {},
          //             endpoint?.headers,
          //             endpoint?.params,
          //             endpoint?.responseType
          //           )
          //         }
          //       }
          //     : undefined
          // }
          {...eventHandlerProps}
        />
      ) : ['Table'].includes(element?._type) && CurrentComponent ? (
        <CurrentComponent
          {...(elementPropsObject ?? {})}
          {...injectedIconsDict}
          {...elementArrayIconInjectionDict}
          data={clientSortedFilteredTableData}
          onSetFilters={(newFilters: any) => {
            actions.ui.setTableFilters(elementAdj._id, newFilters)
          }}
          filters={tableUis?.[element._id]?.filters ?? []}
          sx={
            !isProduction
              ? {
                  ...((elementPropsObject as any)?.sx ?? {}),
                  position: 'relative',
                }
              : (elementPropsObject as any)?.sx
          }
          rootInjection={<RootElementOverlay {...rootElementOverlayProps} />}
          {...eventHandlerProps}
        />
      ) : ['Form'].includes(element?._type) && CurrentComponent ? (
        <CurrentComponent
          {...(elementPropsObject ?? {})}
          {...injectedIconsDict}
          {...elementArrayIconInjectionDict}
          formData={appController.actions.getFormData(elementAdj._id)}
          onChangeFormData={
            /* eslint-disable @typescript-eslint/no-unused-vars */
            (
              newFormData: any,
              propertyKey: string,
              propertyValue: any,
              prevFormData: any
              /* eslint-enable @typescript-eslint/no-explicit-any */
            ) => {
              appController.actions.changeFormData(elementAdj._id, newFormData)
            }
          }
          sx={
            !isProduction
              ? {
                  ...((elementPropsObject as any)?.sx ?? {}),
                  position: 'relative',
                }
              : (elementPropsObject as any)?.sx
          }
          rootInjection={<RootElementOverlay {...rootElementOverlayProps} />}
          {...eventHandlerProps}
        />
      ) : //  NAVIGATION ELEMENTS (slightly different interface)
      ['Tabs', 'BottomNavigation', 'ListNavigation', 'ButtonGroup'].includes(
          element?._type
        ) && CurrentComponent ? (
        <CurrentComponent
          {...((elementPropsObject as any) ?? {})} // icon injections needed ? -> more generic approach
          {...injectedIconsDict}
          {...elementArrayIconInjectionDict}
          onChange={onTabChange}
          value={navValueState}
          sx={
            !isProduction
              ? {
                  ...((elementPropsObject as any)?.sx ?? {}),
                  position: 'relative',
                }
              : (elementPropsObject as any)?.sx
          }
          rootInjection={<RootElementOverlay {...rootElementOverlayProps} />}
          {...eventHandlerProps}
        >
          {renderedElementChildren}
        </CurrentComponent>
      ) : element?._type === 'AppBar' ? (
        <AppBar
          {...((elementPropsObject as any) ?? {})}
          {...injectedIconsDict}
          {...elementArrayIconInjectionDict}
          sx={
            ((elementPropsObject as any)?.position === 'fixed' ||
              !(elementPropsObject as any)?.position) &&
            !isProduction
              ? {
                  ...((elementPropsObject as any)?.sx ?? {}),
                  top: 42,
                  left: editorState.ui.previewMode ? 0 : 364,
                  width: editorState.ui.previewMode
                    ? '100%'
                    : 'calc(100% - 364px - 350px)',
                }
              : { ...((elementPropsObject as any)?.sx ?? {}) }
          }
          onChange={onTabChange}
          value={navValueState}
          {...eventHandlerProps}
        >
          {renderedElementChildren}
          <RootElementOverlay {...rootElementOverlayProps} />
        </AppBar>
      ) : element?._type === 'Paper' ? (
        <Paper
          {...((elementPropsObject as any) ?? {})}
          {...injectedIconsDict}
          {...elementArrayIconInjectionDict}
          sx={
            !isProduction
              ? {
                  ...((elementPropsObject as any)?.sx ?? {}),
                  position: 'relative',
                }
              : (elementPropsObject as any)?.sx
          }
          onChange={onTabChange}
          value={navValueState}
          {...eventHandlerProps}
        >
          {renderedElementChildren}
          <RootElementOverlay {...rootElementOverlayProps} />
        </Paper>
      ) : // Navigation Container -> specific render case (but could be component, too)
      element?._type === 'NavContainer' ? (
        (() => {
          const { children, ...childLessProps } =
            (elementPropsObject as any) ?? {}

          return (
            <Box
              {...(childLessProps ?? {})}
              {...eventHandlerProps}
              {...injectedIconsDict}
              {...elementArrayIconInjectionDict}
            >
              {TabChildren}
            </Box>
          )
        })()
      ) : null
    ) : null
  })
  return rawElements
}
