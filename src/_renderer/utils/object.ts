import { isObject, transform, isEqual } from 'lodash'

export function getDeepDifference(object: any, base: any) {
  function changes(object: any, base: any) {
    return transform(object, function (result: any, value, key) {
      if (!isEqual(value, base[key])) {
        result[key] =
          isObject(value) && isObject(base[key])
            ? changes(value, base[key])
            : value
      }
    })
  }
  return changes(object, base)
}

export const getDeepPropertyByPath = (obj: any, path: string[]) =>
  path.reduce((acc, part) => acc && acc[part], obj)
