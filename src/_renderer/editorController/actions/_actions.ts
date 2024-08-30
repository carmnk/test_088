import { Dispatch, SetStateAction } from 'react'
import {
  EditorControllerAppStateReturnType,
  EditorControllerType,
} from '../editorControllerTypes'
import { EditorStateType } from '../editorState'
import { useEditorControllerAssetActions } from './assetActions'
import { useEditorControllerCssSelectorActions } from './cssSelectorActions'
import { useEditorControllerElementActions } from './elementActions'
import { useEditorControllerProjectActions } from './projectActions'
import { useEditorControllerServerConfigActions } from './serverConfigActions'
import { useEditorControllerThemesActions } from './themesActions'
import { useEditorControllerUi } from './uiActions'
import { ElementType } from '../editorState'
import { useEditorControllerExternalApiActions } from './externalApiActions'
import { useUserActions } from './userActions'

export const useEditorActions = (params: {
  editorState: EditorStateType
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
  selectedHtmlElement: ElementType | null
  selectedHtmlElementStyleAttributes2: Record<string, any>
  selectedPageHtmlElements2: EditorControllerType['selectedPageHtmlElements2']
  currentViewportElements: EditorControllerType['currentViewportElements']
  appController: EditorControllerAppStateReturnType
  components: any[]
}) => {
  const {
    editorState,
    setEditorState,
    selectedHtmlElement,
    selectedHtmlElementStyleAttributes2,
    selectedPageHtmlElements2,
    appController,
    currentViewportElements,
    components,
  } = params
  const serverConfigState = useEditorControllerServerConfigActions({
    editorState,
    setEditorState,
  })

  const htmlElementActions = useEditorControllerElementActions({
    editorState,
    appController,
    setEditorState,
    selectedHtmlElement,
    selectedHtmlElementStyleAttributes: selectedHtmlElementStyleAttributes2,
    selectedPageHtmlElements: selectedPageHtmlElements2,
    currentViewportElements,
    components,
  })
  const cssSelectorActions = useEditorControllerCssSelectorActions({
    editorState,
    setEditorState,
  })
  const projectActions = useEditorControllerProjectActions({
    editorState,
    setEditorState,
    currentViewportElements,
    components,
  })
  const themesActions = useEditorControllerThemesActions({
    setEditorState,
  })
  const assetActions = useEditorControllerAssetActions({
    editorState,
    setEditorState,
  })
  const uiActions = useEditorControllerUi({
    editorState,
    setEditorState,
    changeCurrentHtmlElementStyleAttribute:
      htmlElementActions.changeCurrentHtmlElementStyleAttribute,
    activeElementStyles: selectedHtmlElementStyleAttributes2,
    currentViewportElements,
  })
  const externalApiActions = useEditorControllerExternalApiActions({
    editorState,
    setEditorState,
  })

  const userActions = useUserActions({
    editorState,
    setEditorState,
    currentViewportElements,
    // components: COMPONENT_MODELS,
  })

  return {
    project: projectActions,
    htmlElement: htmlElementActions,
    cssSelector: cssSelectorActions,
    themes: themesActions,
    assets: assetActions,
    ui: uiActions,
    serverConfig: serverConfigState,
    externalApi: externalApiActions,
    events: userActions,
  }
}
