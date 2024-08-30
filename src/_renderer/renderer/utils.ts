import {
  ComponentElementTypes,
  ElementKeyType,
} from '../editorController/editorState'

export const isStringLowerCase = (str: string): boolean => {
  return str === str.toLowerCase()
}

export const isComponentType = (
  type: ElementKeyType
): type is ComponentElementTypes => !isStringLowerCase(type.slice(0, 1))
