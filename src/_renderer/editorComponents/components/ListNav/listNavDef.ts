import { mdiFormatListNumbered } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { ListNavPropsSchema } from './listNavPropsRawSchema'
import { ListNavigation } from '@cmk/fe_utils'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'
import { ComponentDefType } from '../../componentDefType'

export const listNavEditorComponentDef: ComponentDefType = {
  type: 'ListNavigation' as const,
  props: {
    // children: "test",
    // noWrap: false,
    // align: "inherit",
    items: [{ value: 'test', label: 'test' }],
    sx: {},
    slotProps: {
      listItem: {},
      listItemButton: {},
      listItemIcon: {},
      listItemText: {},
      icon: {},
    },
  },
  state: 'test',
  formGen: (editorController: EditorControllerType) =>
    propertyFormFactory(
      ListNavPropsSchema,
      editorController
      //   {
      //   dynamicOptionsDict: {
      //     component: [
      //       { value: undefined, label: 'Default (depends on variant)' },
      //       ...HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS,
      //     ],
      //   },
      // }
    ),
  //   formGen: ButtonGroupComponentPropsFormFactory,
  icon: mdiFormatListNumbered,
  category: 'navigation',
  component: ListNavigation,
  schema: ListNavPropsSchema,
}

// ButtonPropsSchema
