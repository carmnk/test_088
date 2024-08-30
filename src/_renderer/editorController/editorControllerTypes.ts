import { EditorStateType, ElementType } from './editorState'
import { useEditorActions } from './actions/_actions'

export type EditorControllerType = {
  editorState: EditorStateType
  appController: EditorControllerAppStateReturnType
  setEditorState: React.Dispatch<React.SetStateAction<EditorStateType>>

  // getSelectedCssClass: (className?: string) => CSSProperties;
  getSelectedImage: (imageId?: string) => {
    image: typeof Image
    fileName: string
    src: string
    imageSrcId: string
  } | null
  //
  selectedHtmlElement: ElementType | null
  selectedPageHtmlElements2: ElementType[]
  selectedHtmlElementStyleAttributes2: React.CSSProperties
  currentViewportElements: ElementType[]
  COMPONENT_MODELS: any[]

  actions: ReturnType<typeof useEditorActions>
}

export type EditorControllerAppStateType = {
  [key: string]: any
  forms: { [key: string]: Record<string, any> }
  _data: { [key: string]: any }
  // tables: { [key: string]: Record<string, any> }
}
export type EditorControllerAppStateReturnType = {
  state: EditorControllerAppStateType
  // values: { [key: string]: string[] };
  actions: {
    addProperty: (key: string, value: any) => void
    removeProperty: (key: string) => void
    updateProperty: (key: string, value: any) => void
    changeFormData: (
      elementId: string,
      newFormData: Record<string, any>
    ) => void
    getFormData: (elementId: string) => Record<string, any>
    updateData: (key: string, value: any) => void
    removeData: (key: string) => void
  }
  // setStateValues: Dispatch<SetStateAction<{ [key: string]: string[] }>>;
}

// export type EditorControllerCssSelectorActionsType = {
//   removeRule: (ruleName: string) => void
//   addNewRule: () => void
//   toggleEditRule: (ruleName: keyof CSSProperties) => void
//   changeEditRuleValue: (newValue: string) => void
//   changeClassName: (newClassName: string, currentId: string) => void
//   changeAddClassRuleName: (newValue: string) => void
//   changeAddClassRuleValue: (newValue: string) => void
//   deleteCssSelector: (name: string) => void
//   addCssSelector: (newVal: string) => void
// }

// export type EditorControllerHtmlElementActionsType = {
//   deleteElement: (newValue: string | number) => void
//   addElementChild: (newValue: string, newElementType?: string) => void
//   toggleHtmlElementEditCssRule: (attributeName: string) => void
//   changeHtmlElementEditedCssRuleValue: (
//     newValue: string,
//     activeEditRule: string
//   ) => void
//   changeCurrentHtmlElement: (
//     newHtmlElement: ElementType | ((current: ElementType) => ElementType)
//   ) => void
//   changeCurrentHtmlElementStyleAttribute: (
//     ruleValue: string,
//     ruleName: string
//   ) => void
//   changeCurrentHtmlElementAttribute: (
//     attributeName: string,
//     attributeValue: string
//   ) => void
//   changeCurrentElementProp: (
//     propName: keyof ElementType,
//     propValue: string
//   ) => void
//   changeElementProp: (
//     elementId: string,
//     propName: keyof ElementType,
//     propValue: string
//   ) => void
//   removeCurrentHtmlElementStyleAttribute: (ruleName: string) => void
//   addComponentChild: (newValue: string, type: ComponentElementTypes) => void
//   changeSelectedComponentProp: (key: string, value: any) => void
//   changeComponentProp: (componentId: string, key: string, value: any) => void
//   swapHtmlElements: (elementId: string, targetElementId: string) => void
//   insertElementIntoElement: (elementId: string, targetElementId: string) => void
// }

// export type EditorControllerThemesActionsType = {
//   changeThemePaletteColor: (params: {
//     themeName: string
//     colorKey: keyof Theme['palette']
//     subKey?: string
//     newValue: string
//   }) => void
//   changeTypographyStyle: (params: {
//     variantKey: keyof Theme['typography']
//     //   styleKey: keyof Theme['typography']['caption']
//     newVariantStyles: any
//   }) => void
// }

// export type EditorControllerUiActionsType = {
//   switchDragMode: (newValue: 'reorder' | 'margin' | 'padding') => void
//   setTableFilters: (newValue: string, newFilters: any[]) => void
//   togglePreviewMode: () => void
//   changePointerMode: (newValue: UI_POINTER_MODE) => void
//   selectStateComponent: (newValue: string) => void
//   selectFont: (fontFamily: string) => void
//   selectServerSetting: (newValue: string) => void
//   selectEntity: (newValue: string) => void
//   selectEntityElementTab: (newValue: string) => void
//   postAddActiveBoundingRect: (boundingRect: any) => void
//   // changeThemePaletteColor: (params: {
//   //   themeName: string
//   //   colorKey: keyof Theme['palette']
//   //   subKey?: string
//   //   newValue: string
//   // }) => void
//   toggleEditorTheme: (currentThemeName: string) => void
//   selectHtmlPage: (newValue: string | null) => void
//   selectElement: (newValue: string, boundingRect: any) => void
//   selectHoveredElement: (newValue: string) => void
//   selectCssClass: (newValue: string) => void
//   selectImage: (newValue: string) => void
//   selectViewport: (newValue: 'sm' | 'md' | 'lg' | 'xl') => void
//   navigationMenu: {
//     switchNavigationTab: (newValue: string) => void
//     switchBackendNavigationTab: (newValue: string) => void
//     toggleElementAddComponentMode: (nodeId: string | null) => void
//     expandHtmlElementTreeItem: (newValue: string) => void
//     selectTheme: (newValue: string) => void
//     switchMenu: (newValue: EditorStateLeftMenuGlobalTabs) => void
//   }
//   detailsMenu: {
//     selectHtmlElementCssPropertiesListFilter: (newValue: string) => void
//     changeHtmlElementStyleTab: (newValue: string) => void
//   }
//   startDraggingReorder: (
//     elementIdFrom: string
//     // boundingRect: { top: number; left: number; width: number; height: number }
//   ) => void
//   endDraggingReorder: (elementIdTo: string) => void
//   moveDraggingReorder: (elementIdTo: string) => void
//   endDraggingMarginPadding: () => void
//   moveDraggingMarginPadding: (mouseX: number, mouseY: number) => void
//   startDraggingMarginPadding: (
//     elementIdFrom: string,
//     side: 'top' | 'bottom' | 'left' | 'right',
//     mouseX: number,
//     mouseY: number
//   ) => void
//   changeHoveredElementSide: (
//     newValue: 'top' | 'right' | 'bottom' | 'left' | null
//   ) => void
// }

// export type EditorControllerServerConfigActionsType = {
//   toggleServeFrontend: () => void
//   changeSslPrivateKeyPath: (newValue: string) => void
//   changeSslCertificatePath: (newValue: string) => void
//   toggleDisableHttps: () => void
//   // toggleDisableHttp: () => void
//   changeHttpPort: (newValue: number) => void
//   // changeHttpsPort: (newValue: string) => void
//   changeAllowedOrigins: (newValue: string[]) => void
//   changePostgresConfig: (
//     newValue: string,
//     valueType: 'host' | 'port' | 'db' | 'user' | 'password'
//   ) => void
// }
