import { mdiRectangleOutline } from '@mdi/js'
import { NavContainerComponentPropsFormFactory } from './NavContainerPropFormFactory'
import { ComponentDefType } from '../../componentDefType'

export const navigationContainerDef: ComponentDefType = {
  type: 'NavContainer' as const,
  props: {
    // children: "test",
    // noWrap: false,
    // align: "inherit",
    navigationElementId: null,
    children: [],
  },
  formGen: NavContainerComponentPropsFormFactory,
  icon: mdiRectangleOutline,
  category: 'navigation',
  schema: null as any,
}
