// import { ChipProps } from '@mui/material'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'
import { ElementType } from '../../../editorController/editorState'
import { GenericFormProps } from '@cmk/fe_utils'

// type FormDataType = ChipProps
// type ParameterType = {
//   initialFormData?: Partial<FormDataType>
// }

// const booleanOptions = [
//   { value: false, label: 'false' },
//   { value: true, label: 'true' },
// ]

const optionsDict = {
  // disabled: booleanOptions,
}

type GenerateFieldProps = {
  type: string
  name: string
}
type GenerateOptionsDictType = {
  [key: string]: { value: any; label: string }[]
}

type GenerateFormPropsType = {
  optionsDict: GenerateOptionsDictType
  initialFormData: { [key: string]: any }
  fields: GenerateFieldProps[]
  subforms?: { [key: string]: GenericFormProps }
}
const generateFormProps = (params: GenerateFormPropsType): GenericFormProps => {
  const {
    optionsDict,
    initialFormData,
    fields: fieldsIn,
    subforms,
    injections: injectionsIn,
  } = params as any
  const fields = fieldsIn.map((field: any) => {
    // const isOption = field?.name in options;
    const fieldProps = {
      ...field,
      label: field?.name,
    }
    return fieldProps
  })
  const injections = {
    ...(injectionsIn ?? {}),
    options: { ...(optionsDict ?? {}), ...(injectionsIn?.options ?? {}) },
    initialFormData: initialFormData,
  }
  const formProps = {
    injections,
    fields,
    subforms,
  }
  return formProps as any
}

export const NavContainerComponentPropsFormFactory = (
  editorController: EditorControllerType,
  selectedComponent: any
) => {
  const pageElements = editorController.selectedPageHtmlElements2
  const navElements = pageElements.filter(
    (el: any) =>
      el._type.slice(0, 1).toUpperCase() === el._type.slice(0, 1) &&
      'state' in el
  )
  const elementAttributes = editorController.editorState.attributes.filter(
    (attr) => attr.element_id === selectedComponent._id
  )
  const elementAttributesDict = elementAttributes.reduce<Record<string, any>>((acc, attr) => {
    return {
      ...acc,
      [attr.attr_name]: attr.attr_value,
    }
  }, {})
  const navigationElementIdOptions = navElements.map((el) => ({
    value: el._id,
    label: el._type + elementAttributesDict?.id ?? '',
  }))

  console.log('OPTIONS NAV ELEMENT , ', optionsDict, navigationElementIdOptions)
  return generateFormProps({
    optionsDict,
    initialFormData: {
      // children: "test",
    },
    fields: [
      {
        type: 'select',
        name: 'navigationElementId',
      },
      {
        type: 'array',
        name: 'items',
      },
    ],
    injections: {
      options: {
        navigationElementId: navigationElementIdOptions,
      },
      //   disabled: {
      //     defaultValue: true,
      //   },
    },
    subforms: {
      items: ItemPropsFormFactory(editorController, selectedComponent),
    },
  } as any)
}

export const ItemPropsFormFactory = (
  editorController: EditorControllerType,
  selectedComponent: ElementType<'Button'>
) => {
  // const tabsValues =
  return {
    fields: [
      {
        type: 'select',
        name: 'value',
        label: 'value',
      },
      {
        type: 'select',
        name: 'childId',
        label: 'childId',
      },
    ],
    injections: {
      options: {
        value: (formData: any, rootFormData: any) => {
          // const selectedNaveElementId = rootFormData?.navigationElementId

          const selectedElementId =
            editorController?.editorState?.ui?.selected?.element
          const selectedElement =
            editorController?.currentViewportElements?.find(
              (el) => el._id === selectedElementId
            )
          const isSelectedElementNavContainer =
            selectedElement?._type === 'NavContainer'
          if (!isSelectedElementNavContainer) return []
          const navigationElementId = (selectedElement as any)?.props
            ?.navigationElementId
          const navigationElement =
            editorController?.currentViewportElements?.find(
              (el) => el._id === navigationElementId
            )
          const navItemOptions = (navigationElement as any)?.props?.items

          // const navigationElement =
          //   editorController?.currentViewportElements?.find(
          //     (el) => el._id === selectedNaveElementId
          //   )
          // const navTabs = (navigationElement as any)?.props?.items?.map?.(
          //   (tab: any) => ({
          //     value: tab.value,
          //     label: tab.label,
          //   })
          // )
          console.log(
            'NavContainerPropFormFactory.ts - value Options',
            navItemOptions
          )
          console.log(
            'NavContainerPropFormFactory.ts - value Options - filtered opts',
            navigationElement,
            editorController?.currentViewportElements,
            'rootFormData',
            rootFormData,
            'formData',
            formData,
            'EditorController',
            editorController,
            'NEW APPROACH',
            selectedElementId,
            isSelectedElementNavContainer,
            selectedElement,
            navigationElement,
            navItemOptions
          )
          return navItemOptions ?? []
        },
        childId: (formData: any, rootFormData: any) => {
          const selectedNavContainerId = selectedComponent._id
          const navigationContainer =
            editorController?.currentViewportElements?.find(
              (el) => el._id === selectedNavContainerId
            )
          const selectedNaveElementId = rootFormData?.navigationElementId
          const navigationElement =
            editorController?.currentViewportElements?.find(
              (el) => el._id === selectedNaveElementId
            )
          const navTabs = (navigationElement as any)?.props?.items?.map?.(
            (tab: any) => ({
              value: tab.value,
              label: tab.label,
            })
          )
          const children =
            editorController?.currentViewportElements
              ?.filter((el) => el._parentId === selectedNavContainerId)
              ?.map((child) => ({
                value: child?._id,
                label: child?._type,
                stateValue: navTabs?.find(
                  (tab: any) =>
                    tab.value ===
                    (navigationContainer as any)?.props?.items?.find(
                      (item: any) => item.childId === child?._id
                    )?.value
                )?.value,
              })) ?? []
          return children ?? []
        },
      },
    },
  }
}
