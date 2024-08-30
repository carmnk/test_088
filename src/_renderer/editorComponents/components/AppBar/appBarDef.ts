import { mdiDockTop } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { appBarPropsSchema } from './appBarPropsRawSchema'
import { AppBarWrapper } from './AppBarWrapper'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'
import { ComponentDefType } from '../../componentDefType'

export const appBarDef: ComponentDefType = {
  //   ...paperDef,
  type: 'AppBar' as const,
  props: {
    // children: "test",
    // noWrap: false,
    // align: "inherit",,
    sx: {},
    children: [],
  },

  formGen: (editorController: EditorControllerType) =>
    propertyFormFactory(
      appBarPropsSchema,
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
  icon: mdiDockTop,
  category: 'surface',
  schema: appBarPropsSchema,
  component: AppBarWrapper,
}
