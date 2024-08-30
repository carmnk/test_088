import { cloneDeep } from 'lodash'
import { CSSProperties } from 'react'
import { useCallback, Dispatch, SetStateAction, useMemo } from 'react'
import {
  EditorStateType,
  ComponentElementTypes,
  defaultPageElements,
  TemplateComponent,
} from '../editorState'
import { ElementType, AlternativeViewportElement } from '../editorState'
import { v4 as uuid } from 'uuid'
import { EditorControllerType } from '../editorControllerTypes'

export type EditorControllerHtmlElementActionsParams = {
  editorState: EditorStateType
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
  selectedPageHtmlElements: EditorControllerType['selectedPageHtmlElements2']
  selectedHtmlElement: EditorControllerType['selectedHtmlElement'] | null
  selectedHtmlElementStyleAttributes: CSSProperties | null
  appController: EditorControllerType['appController']
  currentViewportElements: EditorControllerType['currentViewportElements']
  components: any[]
}

export const useEditorControllerElementActions = (
  params: EditorControllerHtmlElementActionsParams
) => {
  const {
    editorState,
    setEditorState,
    selectedHtmlElement,
    selectedHtmlElementStyleAttributes,
    appController,
    currentViewportElements,
    components,
  } = params

  const clearViewport = useCallback(
    (viewport: string) => {
      setEditorState((current) => {
        const rootElement = current.elements.find((el) => el._parentId === null)
        if (!rootElement) {
          console.warn(
            'editorControllerElementActions.ts - clearViewport - no root element found'
          )
          return current
        }
        console.log('CLEAR VIEWPORT', viewport, defaultPageElements())
        return {
          ...current,
          alternativeViewports: {
            ...current.alternativeViewports,
            [viewport]: [
              {
                ...rootElement,
                viewport,
                _id: uuid(),
                page: current.ui.selected.page ?? 'index',
                viewport_ref_element_id: rootElement._id,
                viewport_db_element_id: rootElement._id,
              },
            ],
          },
          ui: {
            ...current.ui,
            selected: {
              ...current.ui.selected,
              viewport: viewport as any,
            },
          },
        }
      })
    },
    [setEditorState]
  )
  const resetViewportToXs = useCallback(
    (viewport: string) => {
      setEditorState((current) => {
        return {
          ...current,
          alternativeViewports: {
            ...current.alternativeViewports,
            [viewport]: [],
          },
          ui: {
            ...current.ui,
            selected: {
              ...current.ui.selected,
              viewport: viewport as any,
            },
          },
        }
      })
    },
    [setEditorState]
  )

  const getElementsAllParentIds = useCallback(
    (elementId: string, viewport?: 'sm' | 'md' | 'lg' | 'xl') => {
      const elements = viewport ? currentViewportElements : editorState.elements
      const element = elements.find((el) => el._id === elementId)
      if (!element) {
        return []
      }
      const parentIds = []
      let currentParentElementId = element._parentId
      while (currentParentElementId) {
        parentIds.push(currentParentElementId)
        const currentElement = elements.find(
          (el) => el._id === currentParentElementId
        )
        if (!currentElement) {
          break
        }
        currentParentElementId = currentElement._parentId
      }
      return parentIds
    },
    [currentViewportElements, editorState.elements]
  )

  const getAllElementsBeforeElement = useCallback(
    (elementId: string, viewport?: 'sm' | 'md' | 'lg' | 'xl') => {
      const elements = viewport ? currentViewportElements : editorState.elements
      const element = elements.find((el) => el._id === elementId)
      if (!element) {
        return []
      }
      const parentIds = getElementsAllParentIds(elementId)
      if (!parentIds?.length) {
        return [] // root element
      }
      let childId = elementId
      const elementsBefore = []
      for (let p = 0; p < parentIds.length; p++) {
        const parentId = parentIds[p]
        const parent = elements.find((el) => el._id === parentId)
        if (!parent) {
          // cannot happen -> parentIds are valid via getElementsAllParentIds()
          return []
        }
        const parentChildren = elements.filter(
          (el) => el._parentId === parentId
        )
        const currentParentsChildIdx = parentChildren.findIndex(
          (el) => el._id === childId
        )
        const elementsBeforeCurrentElement = parentChildren.slice(
          0,
          currentParentsChildIdx
        )
        const elementsBeforeCurrentElementIds =
          elementsBeforeCurrentElement.map((el) => el._id)
        childId = parentId
        elementsBefore.unshift(...elementsBeforeCurrentElementIds)
        elementsBefore.unshift(parentId)
      }

      return elementsBefore
    },
    [editorState.elements, getElementsAllParentIds, currentViewportElements]
  )

  const actions = useMemo(() => {
    const elementAttributes = editorState.attributes.filter(
      (attr) => attr.element_id === editorState.ui.selected.element
    )
    const elementAttributesDict = elementAttributes.reduce<Record<string, any>>(
      (acc, attr) => {
        return {
          ...acc,
          [attr.attr_name]: attr.attr_value,
        }
      },
      {}
    )

    const changeHtmlElementEditedCssRuleValue = (
      newValue: string,
      activeEditRule: string
    ) => {
      actions.changeCurrentHtmlElementStyleAttribute(
        newValue,
        activeEditRule ?? ''
      )
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          detailsMenu: {
            ...current.ui.detailsMenu,
            htmlElement: {
              ...current.ui.detailsMenu.htmlElement,
              editCssRuleName: null,
              editCssRuleValue: null,
            },
          },
        },
      }))
    }
    const changeCurrentHtmlElement = (
      newHtmlElementIn: ElementType | ((current: ElementType) => ElementType)
    ) => {
      if (!selectedHtmlElement) return
      const currentViewport = editorState.ui.selected.viewport
      if (currentViewport !== 'xs') {
        actions.changeCurrentViewportSpecificElement(newHtmlElementIn as any)
        return
      }
      const newHtmlElement =
        typeof newHtmlElementIn === 'function'
          ? newHtmlElementIn(selectedHtmlElement)
          : newHtmlElementIn

      setEditorState((current) => {
        const currentElement = current.elements.find(
          (el) => el._id === newHtmlElement._id
        )
        const newStateNewElement: ElementType = {
          ...newHtmlElement,
          _parentId: currentElement?._parentId ?? null,
        }
        return {
          ...current,
          elements: current.elements.map((el) =>
            el._id === newHtmlElement._id ? newStateNewElement : el
          ),
        }
      })
    }
    const changeCurrentHtmlElementStyleAttribute = (
      ruleValue: string,
      ruleName: string
    ) => {
      if (!selectedHtmlElement) return
      if (
        editorState.attributes.find(
          (attr) =>
            attr.attr_name === 'style' &&
            attr.element_id === selectedHtmlElement._id
        )
      ) {
        setEditorState((current) => {
          return {
            ...current,
            attributes: current.attributes.map((attr) =>
              attr.element_id === selectedHtmlElement._id &&
              attr.attr_name === 'style'
                ? {
                    ...attr,
                    attr_value: {
                      ...(elementAttributesDict?.style ?? {}),
                      [ruleName]: ruleValue,
                    },
                  }
                : attr
            ),
          }
        })
        return
      } else {
        const newAttribute = {
          attr_name: 'style',
          attr_value: {
            ...elementAttributesDict,
            [ruleName]: ruleValue,
          },
          element_id: selectedHtmlElement._id,
          attr_id: uuid(),
          project_id: editorState.project.project_id,
          template_id: null,
        }
        setEditorState((current) => {
          return {
            ...current,
            attributes: [...current.attributes, newAttribute],
          }
        })
      }
      // actions.changeCurrentHtmlElement((current) => {
      //   // const currentAttributes =
      //   //   'attributes' in current ? current.attributes : {}
      //   const newAttributes = {
      //     ...elementAttributesDict,
      //     style: {
      //       ...(elementAttributesDict?.style ?? {}),
      //       [ruleName]: ruleValue,
      //     },
      //   }
      //   return {
      //     ...current,
      //     attributes: newAttributes as any,
      //   }
      // })
    }
    const changeCurrentHtmlElementAttribute = (
      attributeName: string,
      attributeValue: string
    ) => {
      // actions.changeCurrentHtmlElement((current) => {
      //   const currentAttributes =
      //     'attributes' in current ? current.attributes : {}
      //   const newAttributes = {
      //     ...(currentAttributes as any),
      //     [attributeName]: attributeValue,
      //   }
      //   return {
      //     ...current,
      //     attributes: newAttributes as any,
      //   }
      // })
      if (!selectedHtmlElement?._id) {
        return
      }
      setEditorState((current) => {
        return {
          ...current,
          attributes: current.attributes.find(
            (attr) =>
              attr.element_id === selectedHtmlElement?._id &&
              attr.attr_name === attributeName
          )
            ? current.attributes.map((attr) =>
                attr.element_id === selectedHtmlElement?._id &&
                attr.attr_name === attributeName
                  ? {
                      ...attr,
                      attr_value: attributeValue,
                      template_id: null,
                      project_id: editorState.project.project_id,
                    }
                  : attr
              )
            : [
                ...current.attributes,
                {
                  element_id: selectedHtmlElement?._id,
                  attr_name: attributeName,
                  attr_value: attributeValue,
                  project_id: current.project.project_id,
                  attr_id: uuid(),
                  template_id: null,
                },
              ],
        }
      })
    }
    const changeCurrentViewportSpecificElement = (
      newElementIn:
        | AlternativeViewportElement
        | ((current: AlternativeViewportElement) => AlternativeViewportElement)
    ) => {
      const currentViewport = editorState.ui.selected.viewport
      if (!selectedHtmlElement || currentViewport === 'xs') {
        console.warn('THIS FUNCTION REQUIRES A SELECTED ELEMENT!')
        return
      }
      const newElement =
        typeof newElementIn === 'function'
          ? newElementIn(selectedHtmlElement as any)
          : newElementIn
      const newElementId = newElement._id

      setEditorState((current) => {
        // viewportElements includes ONLY VIEWPORT SPECIFIC ELEMENTS
        const viewportElements =
          editorState.alternativeViewports[currentViewport]
        const viewportspecificElement = viewportElements.find(
          (el) => el._id === newElementId
        )
        const doesElementExistInViewport = !!viewportspecificElement
        console.log(
          'IN VIEWPORT ? ',
          doesElementExistInViewport,
          newElementId,
          newElement._type,
          'SEL',
          selectedHtmlElement
        )
        // if already a viewport specific element -> just replace
        if (doesElementExistInViewport) {
          return {
            ...current,
            alternativeViewports: {
              ...current.alternativeViewports,
              [currentViewport]: current.alternativeViewports[
                currentViewport
              ].map((el) => (el._id === newElementId ? newElement : el)),
            },
          }
        }
        // OTHERWISE if not a viewport specific element -> add it
        const parentIds = getElementsAllParentIds(newElementId)
        const parentId = parentIds?.[0]
        // const parentId = newElement._parentId
        // if element has no parent (root element) -> add at the beginning of the array
        if (!parentId) {
          return {
            ...current,
            alternativeViewports: {
              ...current.alternativeViewports,
              [currentViewport]: [
                newElement,
                ...(current.alternativeViewports[currentViewport] ?? []),
              ],
            },
          }
        }
        const elementsBefore = getAllElementsBeforeElement(
          newElementId,
          currentViewport
        )
        let pasteIndex2: number | null = null
        for (let e = 0; e < elementsBefore.length; e++) {
          const idx = viewportElements.findIndex(
            (el) => el._id === elementsBefore[e]
          )
          if (idx === -1) {
            continue
          }
          if (idx > (pasteIndex2 ?? 0)) {
            pasteIndex2 = idx
          }
        }
        if (pasteIndex2 === null) {
          console.warn('PASTE INDEX NOT FOUND, inserted at END ')
          return {
            ...current,
            alternativeViewports: {
              ...current.alternativeViewports,
              [currentViewport]: [
                ...(current.alternativeViewports[currentViewport] ?? []),
                newElement,
              ],
            },
          }
        } else {
          return {
            ...current,
            alternativeViewports: {
              ...current.alternativeViewports,
              [currentViewport]: [
                ...viewportElements.slice(0, pasteIndex2 + 1),
                newElement,
                ...viewportElements.slice(pasteIndex2 + 1),
              ],
            },
          }
        }
      })
    }
    const changeCurrentElementProp = (
      propName: keyof ElementType,
      propValue: string
    ) => {
      actions.changeCurrentHtmlElement((current) => {
        return {
          ...current,
          [propName]: propValue,
        }
      })
    }
    const changeElementProp = (
      elementId: string,
      propName: keyof ElementType,
      propValue: string
    ) => {
      const currentViewport = editorState.ui.selected.viewport
      if (currentViewport !== 'xs') {
        const currentElement = currentViewportElements.find(
          (el) => el._id === elementId
        )
        if (!currentElement) {
          console.warn(
            'editorControllerElementActions.ts - changeElementProp - element not found',
            elementId
          )
          return
        }
        // return
        actions.changeCurrentViewportSpecificElement((current) => {
          return {
            ...current,
            [propName]: propValue,
          }
        })
        return
      }
      setEditorState((current) => ({
        ...current,
        elements: current.elements.map((el) =>
          el._id === elementId
            ? {
                ...el,
                [propName]: propValue,
              }
            : el
        ),
      }))
    }
    const deleteElement = (id: string | number) => {
      const currentViewport = editorState.ui.selected.viewport
      if (currentViewport !== 'xs') {
        const currentViewport = editorState.ui.selected.viewport

        const currentElement = currentViewportElements.find(
          (el) => el._id === id
        )
        const currentParentElement = currentViewportElements.find(
          (el) => el._id === currentElement?._parentId
        )
        const currentChildElements = currentViewportElements.filter(
          (el) => el._parentId === currentParentElement?._id
        )
        if (
          currentViewport === 'xs' ||
          !currentElement ||
          !currentParentElement ||
          !currentChildElements
        ) {
          console.warn(
            'editorControllerElementActions.ts - deleteElement - something went wrong'
          )
          return
        }
        const newChildElements = currentChildElements.filter(
          (el) => el._id !== id
        )
        actions.changeCurrentViewportSpecificElementChildren(
          currentParentElement._id,
          newChildElements as any
        )
        setEditorState((current) => {
          const removedEvents = current.events.filter(
            (ev) => ev.element_id === id
          )
          const removeActionIds = removedEvents
            .map((ev) => ev.action_ids)
            .flat()

          const templateId = currentElement.template_id
          const hasAnotherElementThisTemplateId = currentViewportElements.some(
            (el) => el.template_id === templateId && el._id !== id
          )
          return {
            ...current,
            events: current.events.filter((ev) => ev.element_id !== id),
            actions: current.actions.filter(
              (ac) => !removeActionIds.includes(ac.action_id)
            ),
            attributes: current.attributes.filter((attr) =>
              templateId && !hasAnotherElementThisTemplateId
                ? attr.template_id !== templateId && attr.element_id !== id
                : attr.element_id !== id
            ),
            properties: current.properties.filter((prop) =>
              templateId && !hasAnotherElementThisTemplateId
                ? prop.template_id !== templateId && prop.element_id !== id
                : prop.element_id !== id
            ),
            templateComponents: current.templateComponents.filter(
              (comp) =>
                !templateId ||
                hasAnotherElementThisTemplateId ||
                comp.template_id !== templateId
            ),
          }
        })
        return
      }
      setEditorState((current) => {
        const removedEvents = current.events.filter(
          (ev) => ev.element_id === id
        )
        const removeActionIds = removedEvents.map((ev) => ev.action_ids).flat()
        const currentElement = current.elements.find((el) => el._id === id)
        if (!currentElement) {
          console.warn(
            'editorControllerElementActions.ts - deleteElement - element not found',
            id
          )
          return current
        }
        const templateId = currentElement?.template_id
        const hasAnotherElementThisTemplateId = editorState.elements.some(
          (el) => el.template_id === templateId && el._id !== id
        )
        return {
          ...current,
          elements: current.elements.filter((el) => el._id !== id),
          events: current.events.filter((ev) => ev.element_id !== id),
          actions: current.actions.filter(
            (ac) => !removeActionIds.includes(ac.action_id)
          ),
          attributes: current.attributes.filter((attr) =>
            templateId && !hasAnotherElementThisTemplateId
              ? attr.template_id !== templateId && attr.element_id !== id
              : attr.element_id !== id
          ),
          properties: current.properties.filter((prop) =>
            templateId && !hasAnotherElementThisTemplateId
              ? prop.template_id !== templateId && prop.element_id !== id
              : prop.element_id !== id
          ),
          templateComponents: current.templateComponents.filter(
            (comp) =>
              !templateId ||
              hasAnotherElementThisTemplateId ||
              comp.template_id !== templateId
          ),
        }
      })
    }
    const addElementChild = (
      parentElementId: string,
      newElementType?: string
    ) => {
      const currentViewport = editorState.ui.selected.viewport
      if (currentViewport !== 'xs') {
        const parentElement = currentViewportElements.find(
          (el) => el._id === parentElementId
        )
        if (!parentElement) {
          console.warn(
            'editorControllerElementActions.ts - addElementChild - element to add into not found',
            parentElementId
          )
          return
        }
        const newElement = {
          _id: uuid(),
          _type: (newElementType as any) ?? 'div',
          _parentId: parentElementId,
          _page: parentElement._page,
          _userID: '',
          // attributes: {},
        }
        // const currentChildren = currentViewportElements.filter(
        //   (el) => el._parentId === parentElementId
        // )
        // const newChildren = [...currentChildren, newElement]
        actions.changeCurrentViewportSpecificElementChildren(
          parentElementId,
          newElement as any
        )
        return
      }
      setEditorState((current) =>
        !current.ui.selected.page
          ? current
          : {
              ...current,

              elements: [
                ...current.elements,
                {
                  _id: uuid(),
                  _type: (newElementType as any) ?? 'div',
                  _parentId: parentElementId,
                  _page: current.ui.selected.page,
                  _userID: '',
                  template_id: null,
                  // attributes: {},
                },
              ],
              ui: {
                ...current.ui,
                navigationMenu: {
                  ...current.ui.navigationMenu,
                  expandedTreeItems:
                    current.ui.navigationMenu?.expandedTreeItems?.includes(
                      parentElementId
                    )
                      ? current.ui.navigationMenu?.expandedTreeItems
                      : [
                          ...(current.ui.navigationMenu?.expandedTreeItems ??
                            []),
                          parentElementId,
                        ],
                },
              },
            }
      )
    }
    const toggleHtmlElementEditCssRule = (attributeName: string) => {
      setEditorState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          detailsMenu: {
            ...current.ui.detailsMenu,
            htmlElement: {
              ...current.ui.detailsMenu.htmlElement,
              editCssRuleName: current.ui.detailsMenu.htmlElement
                ?.editCssRuleName
                ? null
                : attributeName,
              editCssRuleValue: current.ui.detailsMenu.htmlElement
                ?.editCssRuleName
                ? null
                : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (selectedHtmlElementStyleAttributes as any)?.[
                    attributeName
                  ] ?? '',
            },
          },
        },
      }))
    }
    const removeCurrentHtmlElementStyleAttribute = (ruleName: string) => {
      if (!selectedHtmlElement) return
      setEditorState((current) => {
        return {
          ...current,
          attributes: current.attributes.map((attr) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [ruleName]: rOut, ...restAttributes } =
              elementAttributesDict
            return attr.element_id === selectedHtmlElement._id &&
              attr.attr_name === 'style'
              ? {
                  ...attr,
                  attr_value: restAttributes,
                }
              : attr
          }),
        }
      })

      // actions.changeCurrentHtmlElement((current) => {
      //   const currentAttributes =
      //     'attributes' in current ? current.attributes : {}
      //   const {
      //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
      //     [ruleName as keyof CSSProperties]: rOut,
      //     ...attributesExRemoved
      //   } = (currentAttributes as any)?.style ?? {}
      //   return {
      //     ...current,
      //     attributes: {
      //       ...(currentAttributes as any),
      //       style: attributesExRemoved,
      //     },
      //   }
      // })
    }
    const getPropByNameAndElementId = (key: string, element_id: string) =>
      editorState.properties?.find(
        (prop) => prop.prop_name === key && prop.element_id === element_id
      )?.prop_value

    const changeSelectedComponentProp = (key: string, value: any) => {
      if (!selectedHtmlElement) return
      // TODO: Generic approad
      if (key === 'items') {
        const newTabNames = value
          .map((tab: any) => tab.value)
          ?.sort((a: string, b: string) => (a > b ? 1 : a < b ? -1 : 0))
        const currentTabNames =
          getPropByNameAndElementId('items', selectedHtmlElement._id)?.map?.(
            (tab: any) => tab.value
          ) || []
        // const currentTabNames = appController.values?.[selectedHtmlElement.id]?.sort(
        //   (a: string, b: string) => (a > b ? 1 : a < b ? -1 : 0)
        // );

        // Tabs are different!
        if (newTabNames?.join('') !== currentTabNames?.join('')) {
          // change state value in NavContainers
          console.log('CHANGE NavContainer, too and current tab if needed!')
        }
      }
      setEditorState((current) => {
        return {
          ...current,
          properties: current.properties.find(
            (prop) =>
              prop.element_id === selectedHtmlElement._id &&
              prop.prop_name === key
          )
            ? current.properties.map((prop) =>
                prop.element_id === selectedHtmlElement._id &&
                prop.prop_name === key
                  ? {
                      ...prop,
                      // project_id: current.project.project_id,
                      prop_value: value,
                      // template_id: null, // templates are changed separately
                    }
                  : prop
              )
            : [
                ...current.properties,
                {
                  element_id: selectedHtmlElement._id,
                  prop_name: key,
                  prop_value: value,
                  project_id: current.project.project_id,
                  prop_id: uuid(),
                  template_id: null,
                },
              ],
        }
      })
      // actions.changeCurrentHtmlElement((current) => {
      //   return {
      //     ...current,
      //     props: {
      //       ...((current as any).props ?? {}),
      //       [key]: value,
      //     },
      //   }
      // })
    }
    const swapHtmlElements = (elementId: string, targetElementId: string) => {
      const currentViewport = editorState.ui.selected.viewport
      // specific viewport!
      if (currentViewport !== 'xs') {
        console.log(
          "SWAP ELEMENTS - CURRENT VIEWPORT ISN'T XS",
          currentViewport
        )
        const parentElement1Id = editorState.elements.find(
          (el) => el._id === elementId
        )?._parentId
        const parentElement2Id = editorState.elements.find(
          (el) => el._id === targetElementId
        )?._parentId
        const element1Raw =
          editorState.alternativeViewports[currentViewport].find(
            (el) => el._id === elementId
          ) ||
          (editorState.elements.find(
            (el) => el._id === elementId
          ) as AlternativeViewportElement)
        const element2Raw =
          editorState.alternativeViewports[currentViewport].find(
            (el) => el._id === targetElementId
          ) ||
          (editorState.elements.find(
            (el) => el._id === targetElementId
          ) as AlternativeViewportElement)
        if (
          !parentElement1Id ||
          !parentElement2Id ||
          !element1Raw ||
          !element2Raw
        ) {
          return
        }
        const element1 = cloneDeep(element1Raw)
        const element2 = cloneDeep(element2Raw)
        const viewportSpecificParent1 = editorState.alternativeViewports[
          currentViewport
        ].find((el) => el._id === parentElement1Id)

        const parent1Children = viewportSpecificParent1
          ? editorState.alternativeViewports[currentViewport].filter(
              (el) => el._parentId === parentElement1Id
            )
          : editorState.elements.filter(
              (el) => el._parentId === parentElement1Id
            )

        const viewportSpecificParent2 = editorState.alternativeViewports[
          currentViewport
        ].find((el) => el._id === parentElement2Id)

        const parent2Children = viewportSpecificParent2
          ? editorState.alternativeViewports[currentViewport].filter(
              (el) => el._parentId === parentElement2Id
            )
          : editorState.elements.filter(
              (el) => el._parentId === parentElement2Id
            )
        if (parentElement1Id === parentElement2Id) {
          const newParentChildren = parent1Children.map((el) =>
            el._id === elementId
              ? element2
              : el._id === targetElementId
              ? element1
              : el
          )
          actions.changeCurrentViewportSpecificElementChildren(
            parentElement1Id,
            newParentChildren as any
          )
          return
        } else {
          const newParentChildren1 = parent1Children.map((el) =>
            el._id === elementId ? element2 : el
          )
          const newParentChildren2 = parent2Children.map((el) =>
            el._id === targetElementId ? element1 : el
          )
          actions.changeCurrentViewportSpecificElementChildren(
            parentElement1Id,
            newParentChildren1 as any
          )
          actions.changeCurrentViewportSpecificElementChildren(
            parentElement2Id,
            newParentChildren2 as any
          )
        }
      }
      setEditorState((current) => {
        const element1 = cloneDeep(
          current.elements.find((el) => el._id === elementId)
        )
        const element2 = cloneDeep(
          current.elements.find((el) => el._id === targetElementId)
        )
        if (!element1 || !element2) return current
        return {
          ...current,
          elements: current.elements.map((el) =>
            el._id === elementId
              ? element2
              : el._id === targetElementId
              ? element1
              : el
          ),
        }
      })
    }
    const insertElementIntoElement = (
      elementId: string,
      targetElementId: string
    ) => {
      const currentViewport = editorState.ui.selected.viewport
      if (currentViewport !== 'xs') {
        const currentChildElements = currentViewportElements.filter(
          (el) => el._parentId === targetElementId
        )
        // const lastChildIndexes = currentChildElements.map((childEl) =>
        //   currentViewportElements.findIndex(
        //     (viewportEl) => viewportEl._id === childEl._id
        //   )
        // )
        const insertElement = currentViewportElements.find(
          (el) => el._id === elementId
        )
        if (!insertElement) {
          console.warn(
            'editorControllerElementActions.ts - insertElementIntoElement - element not found',
            elementId,
            insertElement
          )
          return
        }
        const insertElementAdj = {
          ...(insertElement ?? {}),
          _parentId: targetElementId,
        }
        // const lastChildIndex = Math.max(...lastChildIndexes)
        const newChildElements = [
          ...(currentChildElements?.filter?.((el) => el._id !== elementId) ??
            []),
          insertElementAdj,
        ]
        // will delete remove the new element from the viewport specific tree and only add as new child
        actions.changeCurrentViewportSpecificElementChildren(
          targetElementId,
          newChildElements as any
        )
        return
      }
      // SEQUENCE MUST BE CHANGED !!!
      setEditorState((current) => {
        return {
          ...current,
          elements: current.elements.map((el) =>
            el._id === elementId
              ? {
                  ...el,
                  _parentId: targetElementId,
                }
              : el
          ),
        }
      })
    }
    const changeComponentProp = (
      elementId: string,
      key: string,
      value: any
    ) => {
      const currentViewport = editorState.ui.selected.viewport
      if (currentViewport !== 'xs') {
        const currentElement = currentViewportElements.find(
          (el) => el._id === elementId
        )
        if (!currentElement) {
          console.warn(
            'editorControllerElementActions.ts - changeElementProp - element not found',
            elementId
          )
          return
        }
        setEditorState((current) => {
          return {
            ...current,
            properties: current.properties.find(
              (prop) => prop.element_id === elementId && prop.prop_name === key
            )
              ? current.properties.map((prop) =>
                  prop.element_id === elementId && prop.prop_name === key
                    ? {
                        ...prop,
                        prop_value: value,
                      }
                    : prop
                )
              : [
                  ...current.properties,
                  {
                    element_id: elementId,
                    prop_name: key,
                    prop_value: value,
                    project_id: current.project.project_id,
                    prop_id: uuid(),
                    template_id: null,
                  },
                ],
          }
        })
        return
      }
      setEditorState((current) => {
        return {
          ...current,
          properties: current.properties.find(
            (prop) => prop.element_id === elementId && prop.prop_name === key
          )
            ? current.properties.map((prop) =>
                prop.element_id === elementId && prop.prop_name === key
                  ? {
                      ...prop,
                      // project_id: current.project.project_id,
                      prop_value: value,
                    }
                  : prop
              )
            : [
                ...current.properties,
                {
                  element_id: elementId,
                  prop_name: key,
                  prop_value: value,
                  project_id: current.project.project_id,
                  prop_id: uuid(),
                  template_id: null,
                },
              ],
        }
      })
    }
    const changeTemplateProp = (
      templateId: string,
      key: string,
      value: any
    ) => {
      setEditorState((current) => {
        return {
          ...current,
          properties: current.properties.find(
            (prop) => prop.template_id === templateId && prop.prop_name === key
          )
            ? current.properties.map((prop) =>
                prop.template_id === templateId && prop.prop_name === key
                  ? {
                      ...prop,
                      // project_id: current.project.project_id,
                      prop_value: value,
                    }
                  : prop
              )
            : [
                ...current.properties,
                {
                  element_id: null,
                  prop_name: key,
                  prop_value: value,
                  project_id: current.project.project_id,
                  prop_id: uuid(),
                  template_id: templateId,
                },
              ],
        }
      })
    }

    const changeCurrentViewportSpecificElementChildren = (
      elementId: string,
      newChild: AlternativeViewportElement
    ) => {
      const currentViewport = editorState.ui.selected.viewport
      if (currentViewport === 'xs') {
        console.warn('THIS FUNCTION REQUIRES A SELECTED ELEMENT!')
        return
      }
      setEditorState((current) => {
        const viewportElements = current.alternativeViewports[currentViewport]
        const viewportspecificParentElement = viewportElements.find(
          (el) => el._id === elementId
        )
        const doesElementExistInViewport = !!viewportspecificParentElement

        if (doesElementExistInViewport) {
          const viewportElementsExNewChild = viewportElements.filter(
            (el) => el._id !== newChild._id
          )
          const parentElementIdx = viewportElementsExNewChild.findIndex(
            (el) => el._id === elementId
          )
          const parentChildElementIdxs = viewportElementsExNewChild
            .filter((el) => el._parentId === elementId)
            .map((child) =>
              viewportElementsExNewChild.findIndex((el) => el._id === child._id)
            )
          const maxIdx = Math.max(parentElementIdx, ...parentChildElementIdxs)

          const newViewportElements = [
            ...viewportElementsExNewChild.slice(0, maxIdx + 1),
            newChild,
            ...viewportElementsExNewChild.slice(maxIdx + 1),
          ]

          console.debug(
            "editorControllerElementActions.ts - changeCurrentViewportSpecificElementChildren - element's children have noet been changed yet",
            newViewportElements
          )
          return {
            ...current,
            alternativeViewports: {
              ...current.alternativeViewports,
              [currentViewport]: newViewportElements,
            },
          }
          // element does not yet exist in the viewport specific tree
        } else {
          console.debug('need to insert element into viewport')
          const currentElement = current.elements.find(
            (el) => el._id === elementId
          )
          if (!currentElement) {
            console.error('ELEMENT NOT FOUND in elements tree')
            return current
          }

          const elementsBefore = getAllElementsBeforeElement(
            elementId,
            currentViewport
          )
          const currentViewportElementsExNewChild = viewportElements.filter(
            (el) => newChild._id !== el._id
          )
          let pasteIndex2: number | null = null
          for (let e = 0; e < elementsBefore.length; e++) {
            const idx = currentViewportElementsExNewChild.findIndex(
              (el) => el._id === elementsBefore[e]
            )
            if (idx === -1) {
              continue
            }
            if (idx > (pasteIndex2 ?? 0)) {
              pasteIndex2 = idx
            }
          }
          const currentChildren = current.elements.filter(
            (el) => el._parentId && el._parentId === elementId
          )
          console.debug(
            'editorControllerElementActions.ts - changeCurrentViewportSpecificElementChildren - element does not exist yet in viewport',
            currentViewportElementsExNewChild,
            'new elements',
            [
              ...(currentViewportElementsExNewChild ?? []),
              currentElement,
              ...currentChildren,
              newChild,
            ]
          )
          if (pasteIndex2 === null) {
            console.warn('PASTE INDEX NOT FOUND, inserted at END ')

            return {
              ...current,
              alternativeViewports: {
                ...current.alternativeViewports,
                [currentViewport]: [
                  ...(currentViewportElementsExNewChild ?? []),
                  currentElement,
                  ...currentChildren,
                  newChild,
                ],
              },
            }
          } else {
            return {
              ...current,
              alternativeViewports: {
                ...current.alternativeViewports,
                [currentViewport]: [
                  ...currentViewportElementsExNewChild.slice(
                    0,
                    pasteIndex2 + 1
                  ),
                  currentElement,
                  ...currentChildren,
                  newChild,
                  ...currentViewportElementsExNewChild.slice(pasteIndex2 + 1),
                ],
              },
            }
          }
        }
      })
    }
    const addComponentChild = (
      parentElementId: string,
      type: ComponentElementTypes
    ) => {
      const defaultComponent = components.find((comp) => comp.type === type)
      const _id = uuid()
      const currenViewport = editorState.ui.selected.viewport
      const currenPage = editorState.ui.selected.page
      const hasComponentTypeAlreadyTemplate =
        editorState.templateComponents.some((templ) => templ?.type === type)
      const templateId = addTemplateComponentIfNotExists(type)

      const newElement = {
        // props: {},
        ...(defaultComponent as any), // -> TODO -> untangle instance and template
        _id,
        _page: currenPage,
        _userID: '',
        // _content: newElement.content,
        _type: type,
        // _imageSrcId: newElement.imageSrcId,
        // attributes: newElement.attributes,
        _parentId: parentElementId,
        template_id: templateId,
      }
      const initialProps = (defaultComponent as any)?.props ?? {}

      // actions.
      const initialProperties = Object.keys(initialProps).map((key) => ({
        element_id: null as any,
        template_id: templateId,
        prop_name: key,
        prop_value: initialProps[key],
        project_id: editorState.project.project_id,
        prop_id: uuid(),
      }))

      if (currenViewport !== 'xs') {
        const parentElement = currentViewportElements.find(
          (el) => el._id === parentElementId
        )
        if (!parentElement) {
          console.warn(
            'editorControllerElementActions.ts - addElementChild - element to add into not found',
            parentElementId
          )
          return
        }
        // const currentChildren = currentViewportElements.filter(
        //   (el) => el._parentId === parentElementId
        // )
        // const newChildren = [...currentChildren, newElement]
        actions.changeCurrentViewportSpecificElementChildren(
          parentElementId,
          newElement
        )

        setEditorState((current) => {
          // const hasComponentTypeAlreadyTemplate =
          //   current.templateComponents.some((templ) => templ.type === type)
          if (hasComponentTypeAlreadyTemplate) return current
          return {
            ...current,
            properties: [...current.properties, ...initialProperties],
          }
        })
        return
      }

      setEditorState((current) => {
        // const hasComponentTypeAlreadyTemplate = current.templateComponents.some(
        //   (templ) => templ?.type === type
        // )
        return !current.ui.selected.page
          ? current
          : {
              ...current,
              elements: [...current.elements, newElement],
              properties: hasComponentTypeAlreadyTemplate
                ? current.properties
                : [...current.properties, ...initialProperties],
              ui: {
                ...current.ui,
                navigationMenu: {
                  ...current.ui.navigationMenu,
                  expandedTreeItems:
                    current.ui.navigationMenu?.expandedTreeItems?.includes(
                      parentElementId
                    )
                      ? current.ui.navigationMenu.expandedTreeItems
                      : [
                          ...(current.ui.navigationMenu.expandedTreeItems ??
                            []),
                          parentElementId,
                        ],
                },
              },
            }
      })
      if ('state' in (defaultComponent ?? {})) {
        appController.actions.addProperty(
          _id,
          (defaultComponent as any)?.state ?? ''
        )
      }
    }

    const addTemplateComponentIfNotExists = (type: string): string => {
      let templateId = uuid()
      setEditorState((current) => {
        const hasComponentTypeAlreadyTemplate = current.templateComponents.some(
          (templ) => templ.type === type
        )
        if (hasComponentTypeAlreadyTemplate) {
          const defaultTemplateId = current.templateComponents.find(
            (templ) => templ.type === type && templ.is_default
          )?.template_id
          if (defaultTemplateId) {
            templateId = defaultTemplateId
          }
        }
        const newTemplate: TemplateComponent = {
          template_id: templateId,
          template_name: hasComponentTypeAlreadyTemplate
            ? 'New Template'
            : 'default',
          content: null,
          type,
          is_default: !hasComponentTypeAlreadyTemplate,
          project_id: editorState.project.project_id,
        }
        return {
          ...current,
          templateComponents: hasComponentTypeAlreadyTemplate
            ? current.templateComponents
            : [...current.templateComponents, newTemplate],
        }
      })
      return templateId
    }
    const addNewTemplateComponent = (type: string) => {
      const hasComponentTypeAlreadyTemplate =
        editorState.templateComponents.some((templ) => templ.type === type)
      const templateId = uuid()
      const newTemplate: TemplateComponent = {
        template_id: templateId,
        template_name: hasComponentTypeAlreadyTemplate
          ? 'New Template'
          : 'default',
        content: null,
        type,
        is_default: !hasComponentTypeAlreadyTemplate,
        project_id: editorState.project.project_id,
      }
      const defaultComponent = components.find((comp) => comp.type === type)
      const initialProps = (defaultComponent as any)?.props ?? {}
      const initialProperties = Object.keys(initialProps).map((key) => ({
        element_id: null as any,
        template_id: templateId,
        prop_name: key,
        prop_value: initialProps[key],
        project_id: editorState.project.project_id,
        prop_id: uuid(),
      }))
      setEditorState((current) => {
        return {
          ...current,
          templateComponents: [...current.templateComponents, newTemplate],
          properties: [...current.properties, ...initialProperties],
        }
      })
    }

    const changeTemplateComponentName = (
      templateId: string,
      newName: string
    ) => {
      setEditorState((current) => {
        return {
          ...current,
          templateComponents: current.templateComponents.map((el) =>
            el.template_id === templateId
              ? {
                  ...el,
                  template_name: newName,
                }
              : el
          ),
        }
      })
    }
    const changeTemplateComponentIsDefault = (templateId: string) => {
      setEditorState((current) => {
        const templateType = current.templateComponents.find(
          (el) => el.template_id === templateId
        )?.type
        if (!templateType) {
          return current
        }
        return {
          ...current,
          templateComponents: current.templateComponents.map((el) =>
            el.template_id === templateId
              ? {
                  ...el,
                  is_default: true,
                }
              : el.type === templateType
              ? { ...el, is_default: false }
              : el
          ),
        }
      })
    }
    const removeTemplateComponent = (templateId: string) => {
      setEditorState((current) => {
        return {
          ...current,
          templateComponents: current.templateComponents.filter(
            (el) => el.template_id !== templateId
          ),
          properties: current.properties.filter(
            (prop) => prop.template_id !== templateId
          ),
        }
      })
    }
    const changeElementTemplate = (elementId: string, templateId: string) => {
      setEditorState((current) => {
        return {
          ...current,
          elements: current.elements.map((el) =>
            el._id === elementId
              ? {
                  ...el,
                  template_id: templateId,
                }
              : el
          ),
          properties: current.properties.filter(
            (prop) => prop.element_id !== elementId
          ),
        }
      })
    }

    return {
      removeTemplateComponent,
      changeHtmlElementEditedCssRuleValue,
      changeCurrentHtmlElement,
      changeCurrentHtmlElementStyleAttribute,
      changeCurrentHtmlElementAttribute,
      changeCurrentViewportSpecificElement,
      changeCurrentElementProp,
      changeElementProp,
      deleteElement,
      addElementChild,
      toggleHtmlElementEditCssRule,
      removeCurrentHtmlElementStyleAttribute,
      changeSelectedComponentProp,
      swapHtmlElements,
      insertElementIntoElement,
      changeComponentProp,
      changeCurrentViewportSpecificElementChildren,
      addComponentChild,
      clearViewport,
      resetViewportToXs,
      addNewTemplateComponent,
      changeTemplateProp,
      changeTemplateComponentName,
      changeElementTemplate,
    }
  }, [
    setEditorState,
    selectedHtmlElement,
    editorState.ui.selected.viewport,
    currentViewportElements,
    selectedHtmlElementStyleAttributes,
    editorState.alternativeViewports,
    editorState.elements,
    getAllElementsBeforeElement,
    getElementsAllParentIds,
    appController.actions,
    editorState.ui.selected.page,
    components,
    clearViewport,
    resetViewportToXs,
    editorState.properties,
    editorState.project.project_id,
    editorState.attributes,
    editorState.ui.selected.element,
    editorState.templateComponents,
  ])

  return actions
}
