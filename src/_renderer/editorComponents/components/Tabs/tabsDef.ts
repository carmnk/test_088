import { mdiTab } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { TabsPropsSchema } from './tabsPropsRawSchema'
import { Tabs } from '@cmk/fe_utils'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'
import { ComponentDefType } from '../../componentDefType'

export const TabsComponentDef: ComponentDefType = {
  type: 'Tabs' as const,
  props: {
    // children: "test",
    // noWrap: false,
    // align: "inherit",
    items: [{ value: 'test', label: 'test' }],
    sx: {},
    slotProps: {
      activeTab: {},
      inactiveTabs: {},
      tooltip: {},
      tabItemContainer: {},
      icon: {},
      typography: {},
    },
  },
  state: 'test',
  formGen: (editorController: EditorControllerType) =>
    propertyFormFactory(
      TabsPropsSchema,
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
  icon: mdiTab,
  category: 'navigation',
  component: Tabs,
  schema: TabsPropsSchema,
}
