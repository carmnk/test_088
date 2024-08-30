import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { EditorStateType } from './editorState'
import {
  EditorControllerAppStateReturnType,
  EditorControllerAppStateType,
} from './editorControllerTypes'

export type EditorControllerAppStateParams = {
  editorState: EditorStateType
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
  // initialAppState?: EditorControllerAppStateType
}

export const useAppController = (): // params: EditorControllerAppStateParams
EditorControllerAppStateReturnType => {
  // const { editorState, setEditorState } = params
  const [appState, setAppState] = useState<EditorControllerAppStateType>({
    forms: {},
    _data: {},
  })
  // const [stateValues, setStateValues] = useState<any>({})

  // const removeProperty = (key: string) => {
  //   setAppState((current) => {
  //     const { [key]: _, ...rest } = current
  //     return rest
  //   })
  // }

  const actions = useMemo(() => {
    // key is the element id
    const updateProperty = (key: string, value: any) => {
      setAppState((current) => ({ ...current, [key]: value }))
    }
    const removeProperty = (key: string) => {
      setAppState((current) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _, ...rest } = current
        return rest as any
      })
    }
    const changeFormData = (
      elementId: string,
      newFormData: Record<string, any>
    ) => {
      setAppState((current) => {
        // const formData = current.forms?.[elementId] ?? {}
        // const newFormData = { ...formData, [inputName]: value }
        return {
          ...current,
          forms: { ...current.forms, [elementId]: newFormData },
        }
      })
    }

    const getFormData = (elementId: string) => {
      return appState.forms?.[elementId] ?? {}
    }

    const updateData = (key: string, value: any) => {
      setAppState((current) => {
        return {
          ...current,
          _data: { ...current._data, [key]: value },
        }
      })
    }
    const removeData = (key: string) => {
      setAppState((current) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _, ...rest } = current
        return rest as any
      })
    }

    return {
      getFormData,
      changeFormData,
      addProperty: updateProperty,
      removeProperty,
      updateProperty,
      updateData,
      removeData,
    }
  }, [setAppState, appState?.forms])

  return {
    state: appState,
    actions,
  }
}
