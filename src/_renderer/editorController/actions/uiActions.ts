import { Dispatch, SetStateAction, useMemo } from 'react'
import {
  EditorStateLeftMenuBackendTabs,
  EditorStateLeftMenuGlobalTabs,
  EditorStateLeftMenuTabs,
  EditorStateType,
} from '../editorState'
import { UI_POINTER_MODE } from '../../defs/uiPointerMode'

export type EditorControllerAppStateParams = {
  editorState: EditorStateType
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
  changeCurrentHtmlElementStyleAttribute: (
    ruleValue: string,
    ruleName: string
  ) => void
  currentViewportElements: any[]
  activeElementStyles: any
}

export const useEditorControllerUi = (
  params: EditorControllerAppStateParams
) => {
  const {
    editorState,
    setEditorState,
    changeCurrentHtmlElementStyleAttribute,
    activeElementStyles,
    currentViewportElements,
  } = params

  const actions = useMemo(() => {
    return {
      // toggleInitProjectModal: () => {
      //   setEditorState((current) => ({
      //     ...current,
      //     ui: {
      //       ...current.ui,
      //       initializeProjectModal: !current.ui.initializeProjectModal,
      //     },
      //   }))
      // },
      // closeInitProjectModal: () => {
      //   setEditorState((current) => ({
      //     ...current,
      //     ui: {
      //       ...current.ui,
      //       navigationMenu: {
      //         ...current.ui.navigationMenu,
      //         activeMenu: EditorStateLeftMenuGlobalTabs.Frontend,
      //       },
      //       initializeProjectModal: false,
      //     },
      //   }))
      // },
      setProjectInited: () => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            isProjectInited: true,
          },
        }))
      },
      setProjectAutoSaveReady: () => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            isAutoSaveReady: true,
          },
        }))
      },
      changePointerMode: (newValue: UI_POINTER_MODE) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            pointerMode: newValue,
          },
        }))
      },
      toggleEditorTheme: (
        themeNameIn: ((currentThemeName: string) => string) | string
      ) => {
        const themeName =
          typeof themeNameIn === 'function'
            ? themeNameIn(editorState?.theme?.name)
            : themeNameIn
        if (!themeName) return
        setEditorState((current) => ({
          ...current,
          theme:
            current.themes?.find?.((t) => t.name === themeName) ??
            current?.theme,
        }))
      },

      detailsMenu: {
        selectHtmlElementCssPropertiesListFilter: (newValueRaw: string) => {
          const newValue = newValueRaw as 'all' | 'styles' | 'classes'
          setEditorState((current) => ({
            ...current,
            ui: {
              ...current.ui,
              detailsMenu: {
                ...current.ui.detailsMenu,
                htmlElement: {
                  ...current.ui.detailsMenu.htmlElement,
                  cssRulesFilter: newValue,
                },
              },
            },
          }))
        },
        changeHtmlElementStyleTab: (newValue: string) => {
          const newValueTyped = newValue as 'layout' | 'shape' | 'typography'
          setEditorState((current) => ({
            ...current,
            ui: {
              ...current.ui,
              detailsMenu: {
                ...current.ui.detailsMenu,
                htmlElement: {
                  ...current.ui.detailsMenu.htmlElement,
                  activeStylesTab: newValueTyped,
                },
              },
            },
          }))
        },
      },

      selectHtmlPage: (newValue: string | null) => {
        const disableUnselectPage = true
        setEditorState((current) => {
          const currentSelectedPage = current.ui.selected.page
          const newSelectedPage =
            newValue === currentSelectedPage && !disableUnselectPage
              ? null
              : newValue
          return {
            ...current,
            ui: {
              ...current.ui,
              selected: {
                ...current.ui.selected,
                page: newSelectedPage,
                element: null,
              },
            },
          }
        })
      },
      selectApi: (newValue: string) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            selected: { ...current.ui.selected, externalApi: newValue },
          },
        }))
      },
      selectStateComponent: (newValue: string) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            selected: {
              ...current.ui.selected,
              state: newValue,
            },
          },
        }))
      },
      selectCssClass: (newValue: string) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            selected: { ...current.ui.selected, cssSelector: newValue },
          },
        }))
      },
      selectImage: (newValue: string) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            selected: { ...current.ui.selected, image: newValue },
          },
        }))
      },
      selectEntityElementTab: (newValue: string) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            selected: {
              ...current.ui.selected,
              entityElement: newValue as any,
            },
          },
        }))
      },
      selectEntity: (newValue: string) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            selected: { ...current.ui.selected, entity: newValue as any },
          },
        }))
      },
      selectElement: (value: string, boundingRect: any) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            selected: {
              ...current.ui.selected,
              element: value,
              hoveredElement: !value
                ? null
                : current.ui.selected.hoveredElement,
              activeElementBoundingRect: {
                ...boundingRect,
                p: {
                  paddingTop: activeElementStyles?.paddingTop ?? 0,
                  paddingRight: activeElementStyles?.paddingRight ?? 0,
                  paddingBottom: activeElementStyles?.paddingBottom ?? 0,
                  paddingLeft: activeElementStyles?.paddingLeft ?? 0,
                },
                m: {
                  marginTop: activeElementStyles?.marginTop ?? 0,
                  marginRight: activeElementStyles?.marginRight ?? 0,
                  marginBottom: activeElementStyles?.marginBottom ?? 0,
                  marginLeft: activeElementStyles?.marginLeft ?? 0,
                },
              },
            },
          },
        }))
      },
      postAddActiveBoundingRect: (boundingRect: any) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            selected: {
              ...current.ui.selected,
              activeElementBoundingRect: {
                ...boundingRect,
                p: {
                  paddingTop: activeElementStyles?.paddingTop ?? 0,
                  paddingRight: activeElementStyles?.paddingRight ?? 0,
                  paddingBottom: activeElementStyles?.paddingBottom ?? 0,
                  paddingLeft: activeElementStyles?.paddingLeft ?? 0,
                },
                m: {
                  marginTop: activeElementStyles?.marginTop ?? 0,
                  marginRight: activeElementStyles?.marginRight ?? 0,
                  marginBottom: activeElementStyles?.marginBottom ?? 0,
                  marginLeft: activeElementStyles?.marginLeft ?? 0,
                },
              },
            },
          },
        }))
      },
      selectHoveredElement: (value: string, isHovering: boolean) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            selected: {
              ...current.ui.selected,
              hoveredElement: !isHovering ? null : value,
            },
          },
        }))
      },

      selectFont: (nodeId: string | number) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            selected: { ...current.ui.selected, font: nodeId as string },
          },
        }))
      },
      selectServerSetting: (newValue: string) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            selected: {
              ...current.ui.selected,
              serverSetting: newValue as any,
            },
          },
        }))
      },
      togglePreviewMode: () => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            previewMode: !current.ui.previewMode,
            pointerMode:
              !current.ui.previewMode === true
                ? UI_POINTER_MODE.production
                : UI_POINTER_MODE.mixed,
          },
        }))
      },
      navigationMenu: {
        switchMenu: (newValue: EditorStateLeftMenuGlobalTabs) => {
          const isGlobalAppMenu = newValue === EditorStateLeftMenuGlobalTabs.App
          const isFrontend = newValue === EditorStateLeftMenuGlobalTabs.Frontend
          const isBackend = newValue === EditorStateLeftMenuGlobalTabs.Backend
          setEditorState((current) => {
            const newValueActiveFrontendTab = isGlobalAppMenu
              ? null
              : isFrontend
              ? current.ui.navigationMenu.activeTab ??
                EditorStateLeftMenuTabs.PROJECT
              : current.ui.navigationMenu.activeTab
            const newValueActiveBackendTab = isGlobalAppMenu
              ? null
              : isBackend
              ? current.ui.navigationMenu.activeBackendTab ??
                EditorStateLeftMenuBackendTabs.SERVER
              : current.ui.navigationMenu.activeBackendTab
            current.ui.navigationMenu.activeBackendTab

            return {
              ...current,
              ui: {
                ...current.ui,
                navigationMenu: {
                  ...current.ui.navigationMenu,
                  activeMenu: newValue,
                  activeTab: newValueActiveFrontendTab,
                  activeBackendTab: newValueActiveBackendTab,
                },
                selected: {
                  ...current.ui.selected,
                  page: isFrontend
                    ? current.ui.selected.page ?? 'index'
                    : current.ui.selected.page,
                },
              },
            }
          })
        },
        switchNavigationTab: (newValue: string) => {
          setEditorState((current) => ({
            ...current,
            ui: {
              ...current.ui,
              navigationMenu: {
                ...current.ui.navigationMenu,
                activeTab: newValue as EditorStateLeftMenuTabs,
                activeMenu: EditorStateLeftMenuGlobalTabs.Frontend,
                width:
                  current.ui.navigationMenu.width &&
                  current.ui.navigationMenu.activeTab === newValue
                    ? 0
                    : 320,
              },
            },
          }))
        },
        switchBackendNavigationTab: (newValue: string) => {
          setEditorState((current) => ({
            ...current,
            ui: {
              ...current.ui,
              navigationMenu: {
                ...current.ui.navigationMenu,
                activeBackendTab: newValue as EditorStateLeftMenuBackendTabs,
                activeMenu: EditorStateLeftMenuGlobalTabs.Backend,
                width:
                  current.ui.navigationMenu.width &&
                  current.ui.navigationMenu.activeBackendTab === newValue
                    ? 0
                    : 320,
              },
            },
          }))
        },
        toggleElementAddComponentMode: ((nodeId: string | number) => {
          setEditorState((current) => ({
            ...current,
            ui: {
              ...current.ui,
              navigationMenu: {
                ...current.ui.navigationMenu,
                elementAddComponentMode: current.ui.navigationMenu
                  .elementAddComponentMode
                  ? null
                  : (nodeId as any),
              },
            },
          }))
        }) as any,
        expandHtmlElementTreeItem: (value: string) => {
          setEditorState((current) => ({
            ...current,
            ui: {
              ...current.ui,
              navigationMenu: {
                ...current.ui.navigationMenu,
                expandedTreeItems:
                  current.ui.navigationMenu?.expandedTreeItems?.includes(value)
                    ? current.ui.navigationMenu?.expandedTreeItems?.filter(
                        (item) => item !== value
                      )
                    : [
                        ...(current.ui.navigationMenu?.expandedTreeItems ?? []),
                        value,
                      ],
              },
            },
          }))
        },
        selectTheme: (newValue: string) => {
          setEditorState((current) => ({
            ...current,
            ui: {
              ...current.ui,
              navigationMenu: {
                ...current.ui.navigationMenu,
                selectedTheme: newValue,
              },
            },
          }))
        },
      },
      selectTemplate: (newValue: string | null) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            selected: {
              ...current.ui.selected,
              template: newValue,
            },
          },
        }))
      },
      setTableFilters: (tableName: string, newTableFilters: any[]) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            tableUis: {
              ...current.ui.tableUis,
              [tableName]: {
                ...(current.ui.tableUis?.[tableName] ?? {}),
                onSetFilters: (p: any) => {
                  alert('HERE I AM')
                },
                filters: newTableFilters ?? [],
              },
            },
          },
        }))
      },
      switchDragMode: (mode: 'reorder' | 'margin' | 'padding') => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            dragMode: mode,
          },
        }))
      },
      startDraggingReorder: (elementIdFrom: string) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            dragging: {
              elementIdFrom,
              elementIdTo: undefined,
              // elementFromBoundingRect: boundingRect,
            },
          },
        }))
      },
      moveDraggingReorder: (elementIdTo: string) => {
        const elementIdFrom = editorState.ui.dragging?.elementIdFrom
        if (!elementIdFrom) return
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            dragging: { elementIdFrom, elementIdTo },
          },
        }))
      },
      endDraggingReorder: (elementIdTo: string) => {
        const elementIdFrom = editorState.ui.dragging?.elementIdFrom

        if (!elementIdFrom) return

        setEditorState((current) => {
          const elementFrom = currentViewportElements.find(
            (el) => el?._id === elementIdFrom
          )
          const elementTo = currentViewportElements.find(
            (el) => el?._id === elementIdTo
          )
          if (!elementFrom || !elementTo) return current
          return {
            ...current,
            ui: {
              ...current.ui,
              dragging: null,
            },
            elements: currentViewportElements.map((el) =>
              el?._id === elementIdFrom
                ? elementTo
                : el?._id === elementIdTo
                ? elementFrom
                : el
            ),
          }
        })
      },
      changeIsHoveringRightMenu: (newValue: boolean) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            hovering: {
              ...current.ui.hovering,
              rightMenu: newValue,
            },
          },
        }))
      },
      toggleMinimizeRightMenu: () => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            detailsMenu: {
              ...current.ui.detailsMenu,
              width: current.ui.detailsMenu.width === 0 ? 365 : 0,
            },
          },
        }))
      },
      changeIsHoveringLeftMenu: (newValue: boolean) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            hovering: {
              ...current.ui.hovering,
              leftMenu: newValue,
            },
          },
        }))
      },
      changeHoveredElementSide: (
        newValue: 'top' | 'right' | 'bottom' | 'left' | null
      ) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            selected: {
              ...current.ui.selected,
              hoveredElementSide: newValue,
            },
          },
        }))
      },
      changeEditorDragMode: (
        newValue: 'leftMenu' | 'rightMenu' | null,
        e: MouseEvent
      ) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            editDragMode: newValue,
            editorDragStartState: newValue
              ? { mouseDownX: e.clientX, width: current.ui.detailsMenu.width }
              : null,
            selected: {
              ...current.ui.selected,
              hoveredElement: null,
              hoveredElementSide: null,
              activeElementBoundingRect: null,
            },
          },
        }))
      },
      changeRightMenuWidth: (newValue: number) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            detailsMenu: {
              ...current.ui.detailsMenu,
              width: newValue,
            },
          },
        }))
      },
      startDraggingMarginPadding: (
        elementIdFrom: string,
        side: 'top' | 'right' | 'bottom' | 'left',
        mouseX: number,
        mouseY: number
      ) => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            dragging: {
              side,
              elementIdFrom,
              startPointerPos: { x: mouseX, y: mouseY },
              currentPointerPos: { x: mouseX, y: mouseY },
            },
          },
        }))
      },
      moveDraggingMarginPadding: (mouseX: number, mouseY: number) => {
        const elementIdFrom = editorState.ui.dragging?.elementIdFrom
        if (!elementIdFrom) return
        const startPos = editorState.ui.dragging?.startPointerPos
        const currentPos = editorState.ui.dragging?.currentPointerPos
        if (startPos && currentPos) {
          const elementFrom = currentViewportElements.find(
            (el) => el?._id === elementIdFrom
          )
          const elementType = elementFrom?._type
          const isHtmlElement =
            elementType?.slice(0, 1).toLowerCase() === elementType?.slice(0, 1)
          const side = editorState.ui.dragging?.side
          if (isHtmlElement && side) {
            const sidePascalCase = side.charAt(0).toUpperCase() + side.slice(1)
            const propertyNameRaw = editorState?.ui?.dragMode
            if (!['margin', 'padding'].includes(propertyNameRaw)) {
              return
            }
            const propertyName = propertyNameRaw + sidePascalCase
            const startValueContainer =
              editorState?.ui?.selected?.activeElementBoundingRect?.[
                propertyNameRaw === 'margin' ? 'm' : 'p'
              ]
            const startValue =
              startValueContainer?.[
                propertyName as keyof typeof startValueContainer
              ] || 0

            const deltaX =
              currentPos.x -
              startPos.x +
              parseFloat(startValue?.toString()?.replaceAll('px', ''))
            const deltaY =
              currentPos.y -
              startPos.y +
              parseFloat(startValue?.toString()?.replaceAll('px', ''))
            const newValue =
              side === 'top'
                ? `${deltaY}px`
                : side === 'right'
                ? `${-deltaX}px`
                : side === 'bottom'
                ? `${deltaY}px`
                : `${deltaX}px`
            changeCurrentHtmlElementStyleAttribute(newValue, propertyName)
          }
        }
        setEditorState((current) =>
          !current.ui.dragging
            ? current
            : {
                ...current,
                ui: {
                  ...current.ui,
                  dragging: {
                    ...current.ui.dragging,
                    currentPointerPos: { x: mouseX, y: mouseY },
                  },
                },
              }
        )
      },
      endDraggingMarginPadding: () => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            dragging: null,
            selected: {
              ...current.ui.selected,
              hoveredElementSide: null,
            },
          },
        }))
      },
      selectViewport: (newValue: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
        setEditorState((current) => ({
          ...current,
          ui: {
            ...current.ui,
            selected: {
              ...current.ui.selected,
              viewport: newValue || 'xs',
            },
          },
        }))
      },
    }
  }, [
    setEditorState,
    editorState?.theme?.name,
    editorState.ui.dragging?.elementIdFrom,
    editorState.ui.dragging?.currentPointerPos,
    editorState.ui.dragging?.startPointerPos,
    activeElementStyles,
    changeCurrentHtmlElementStyleAttribute,
    currentViewportElements,
    editorState?.ui?.dragMode,
    editorState.ui.dragging?.side,
    editorState.ui?.selected?.activeElementBoundingRect,
  ])

  return actions
}
