import { isEqual } from 'lodash'
import { ExtendedTheme } from '../muiTheme'

export const getDeviatingKeys = (
  obj: Record<string, any>,
  obj2: Record<string, any>
) => {
  return Object.keys(obj).filter(
    (key) => !isEqual(obj[key], obj2?.[key as keyof typeof obj2])
  )
}

export const getRecursiveDeviatingKeys = (
  obj: unknown,
  obj2: unknown
): any[] => {
  if (Array.isArray(obj) && Array.isArray(obj2)) {
    return obj.map((el, eIdx) => {
      const el2 = obj2[eIdx]
      if (Array.isArray(el) && Array.isArray(el2)) {
        return getRecursiveDeviatingKeys(el, el2)?.filter((el) => el)
      }
      if (typeof el === 'object' && typeof el2 === 'object') {
        return getRecursiveDeviatingKeys(el, el2)?.filter((el) => el)
      }
      return el !== el2 ? eIdx : null
    })
  } else if (
    typeof obj === 'object' &&
    typeof obj2 === 'object' &&
    obj &&
    obj2
  ) {
    return Object.keys(obj).map((key) => {
      const keyAdj = key as keyof typeof obj
      if (Array.isArray(obj[keyAdj]) && Array.isArray(obj2[keyAdj])) {
        return getRecursiveDeviatingKeys(obj[keyAdj], obj2[keyAdj])?.filter(
          (el) => el
        )
      }
      if (
        typeof obj[keyAdj] === 'object' &&
        typeof obj2[keyAdj] === 'object' &&
        obj[keyAdj] &&
        obj2[keyAdj]
      ) {
        return getRecursiveDeviatingKeys(obj[keyAdj], obj2[keyAdj])?.filter(
          (el) => el
        )
      }
      return obj[keyAdj] !== obj2[keyAdj] ? keyAdj : null
    })
  }
  return null as any
}

export const trimThemeToCompare = (themes: ExtendedTheme[]) => {
  return themes?.map((th) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { spacing, unstable_sx, typography: typoIn, ...rest } = th
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pxToRem, ...typography } = typoIn
    return {
      ...rest,
      breakpoints: {
        keys: th.breakpoints.keys,
        values: th.breakpoints.values,
      },
      typography,
      transitions: {
        duration: th.transitions.duration,
        easing: th.transitions.easing,
      },
      palette: {
        action: th.palette.action,
        background: th.palette.background,
        common: th.palette.common,
        error: th.palette.error,
        grey: th.palette.grey,
        info: th.palette.info,
        mode: th.palette.mode,
        primary: th.palette.primary,
        secondary: th.palette.secondary,
        success: th.palette.success,
        text: th.palette.text,
        tonalOffset: th.palette.tonalOffset,
        warning: th.palette.warning,
      },
    }
  })
}

export const cleanEmptyProps = (elements: any[]) =>
  elements?.map((el) => {
    const objectKeys = Object.keys(el)
    return objectKeys.reduce((acc, key) => {
      const value = el?.[key as keyof typeof el]

      if (
        ['component', 'formGen'].includes(key) ||
        !value ||
        (Array.isArray(value) && !value.length) ||
        (typeof value === 'object' && !Object.keys(value).length)
      ) {
        return acc
      }
      return { ...acc, [key]: (el as any)[key] }
    }, {})
  })

export const trimUi = (ui: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { activeMenu, expandedTreeItems, selected, ...navigationsMenuRest } =
    ui?.navigationMenu ?? {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { activeElementBoundingRect, ...restSelected } = selected ?? {}
  const newNavigationsMenu = { ...navigationsMenuRest, selected: restSelected }

  return {
    ...ui,
    navigationMenu: newNavigationsMenu,
  }
}
const trimProject = (project: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { edited_datetime, created_datetime, owner_user_id, ...others } =
    project
  return cleanEmptyProps([others])?.[0]
}

export const makeComparableEditorState = (editorState: any) => {
  const ui = trimUi(editorState.ui)
  const themes = trimThemeToCompare(editorState.themes)
  const theme = trimThemeToCompare([editorState.theme])
  const elements = cleanEmptyProps(editorState.elements)
  const project = trimProject(editorState.project)
  const cssSelectors = editorState.cssSelectors?.map((css: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _type, _parentId, _userID, _userId, _id, ...rest } = css
    return { ...rest, css_selector_id: _id, css_selector_name: _userId }
  })

  return {
    ...editorState,
    cssSelectors,
    elements,
    themes,
    theme,
    ui,
    project,
  }
}
