import { useState, useEffect } from 'react'
import { EditorStateType, defaultEditorState } from './editorState'
import { useAppController } from './appController'
import { useEditorActions } from './actions/_actions'
import { useShortcuts } from './useShortcuts'

export const useEditorController = (params?: {
  initialEditorState?: Pick<
    EditorStateType,
    | 'assets'
    | 'cssSelectors'
    | 'defaultTheme'
    | 'elements'
    | 'fonts'
    | 'project'
    | 'themes'
  >
  injections?: {
    components?: any[]
    actions?: any[]
    // hooks?: {
    //   onAppMounted?: () => void
    //   onAppUnmounted?: () => void
    //   onNavigate?: (currentPath: string, newPath: string) => void
    // }
  }
}) => {
  // load initial state if provided
  const { initialEditorState, injections } = params ?? {}
  const initialEditorStateAdj = {
    ...defaultEditorState(),
    ...(initialEditorState ?? {}),
  }
  const [editorState, setEditorState] = useState(initialEditorStateAdj)
  const {
    currentViewportElements,
    selectedHtmlElement,
    selectedHtmlElementStyleAttributes2,
    selectedPageHtmlElements2,
    getSelectedImage,
    COMPONENT_MODELS,
  } = useShortcuts({ editorState, customComponents: injections?.components })

  // initialize default props for elements/components
  useEffect(() => {
    if (!initialEditorState?.elements?.length || !editorState?.elements?.length)
      return // no initial elements
    editorState?.elements?.forEach((el) => {
      const defaultComponentProps = COMPONENT_MODELS.find(
        (comp) => comp.type === el._type
      )
      if (!defaultComponentProps) return
      if ('state' in defaultComponentProps) {
        const _id = el._id
        appController.actions.addProperty(
          _id,
          (defaultComponentProps as any)?.state ?? ''
        )
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // only run once

  const appController = useAppController()

  const actions = useEditorActions({
    editorState,
    setEditorState,
    selectedHtmlElement,
    selectedHtmlElementStyleAttributes2,
    selectedPageHtmlElements2,
    currentViewportElements,
    appController,
    components: COMPONENT_MODELS,
  })

  return {
    selectedHtmlElement,
    selectedPageHtmlElements2,
    selectedHtmlElementStyleAttributes2,
    currentViewportElements,
    COMPONENT_MODELS,
    editorState,
    appController,
    setEditorState,
    // getSelectedCssClass: getSelectedCssClass as any,
    getSelectedImage,
    actions,
  }
}
