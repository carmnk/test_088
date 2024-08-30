import { EditorStateType, ElementType } from '../editorController/editorState'
import { StyledTreeItemProps } from '../treeview/CTreeItem'
import { v4 as uuid } from 'uuid'
import { isComponentType } from './utils'
import { mdiCodeBlockTags, mdiReact } from '@mdi/js'
import Icon from '@mdi/react'
import React from 'react'

export const mapHtmlElementsToTreeItems = (
  elements: ElementType[],
  allElements: ElementType[],
  isDraggable: boolean,
  components: any[],
  properties: EditorStateType['properties'],
  attributes: EditorStateType['attributes'],
  rootElements?: ElementType[],
  parentNavContainerId?: string
): StyledTreeItemProps[] => {
  const treeItems = elements.map((element) => {
    const id = element?._id ?? uuid()

    // const parentNavContainer = parentNavContainerId
    //   ? allElements?.find((el) => el._id === parentNavContainerId)
    //   : null

    const getPropByName = (key: string, element_id: string) =>
      properties?.find(
        (prop) => prop.prop_name === key && prop.element_id === element_id
      )?.prop_value

    const parentNavContainerItems = getPropByName(
      'items',
      parentNavContainerId as any
    )
    // (parentNavContainer as any)?.props?.items ?? []
    const caseName = parentNavContainerItems?.find(
      (item: any) => item.childId === id
    )?.value

    const children = allElements?.filter((el) => el._parentId === id)
    const elementAttributes = attributes?.filter(
      (attr) => attr.element_id === id
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
    return {
      _parentId: element._parentId,
      key: id,
      type: element._type,
      parentNavContainerId,
      nodeId: id,
      element,
      labelIcon: (
        <Icon
          path={
            isComponentType(element._type)
              ? components?.find((com) => com.type === element?._type)?.icon ??
                mdiReact
              : mdiCodeBlockTags
          }
          size={1}
        />
      ),
      labelText:
        (parentNavContainerId ? (caseName ? '↦' + caseName + ':' : '⚠:') : '') +
        (element._type +
          (elementAttributesDict?.id ?? element?._userID
            ? `#${elementAttributesDict?.id ?? element?._userID}`
            : '')),
      children: children?.length
        ? mapHtmlElementsToTreeItems(
            children,
            allElements,
            isDraggable,
            components,
            properties,
            attributes,
            rootElements ?? elements,
            (element?._type === ('NavContainer' as any) ? id : undefined) as any
          )
        : [],
      useDraggable: isDraggable,
    } as StyledTreeItemProps
  }) as StyledTreeItemProps[]
  return treeItems as any
}
