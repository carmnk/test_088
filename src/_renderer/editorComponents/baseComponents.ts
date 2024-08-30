import { buttonEditorComponentDef } from './components/Button/buttonDef'
import { buttonGroupEditorComponentDef } from './components/ButtonGroup/buttonGroupDef'
import { listNavEditorComponentDef } from './components/ListNav/listNavDef'
import { TabsComponentDef } from './components/Tabs/tabsDef'
import { BottomNavComponentDef } from './components/BottomNavigation/bottomNavDefDef'
import { appBarDef } from './components/AppBar/appBarDef'
import { chipEditorComponentDef } from './components/Chip/chipDef'
import { typographyEditorComponentDef } from './components/Typography/typographyDef'
import { tableEditorComponentDef } from './components/Table/TableDef'
import { formEditorComponentDef } from './components/Form/formDef'
import { ComponentDefType } from './componentDefType'
import { navigationContainerDef } from './components/NavigationContainer/navigationContainerDef'
import { paperDef } from './components/Paper/paperDef'

export const baseComponents = [
  typographyEditorComponentDef,
  chipEditorComponentDef,
  // surface components
  appBarDef,
  paperDef,

  // Navigation components
  buttonEditorComponentDef,
  TabsComponentDef,
  BottomNavComponentDef,
  listNavEditorComponentDef,
  buttonGroupEditorComponentDef,

  tableEditorComponentDef,
  formEditorComponentDef,

  // Navigation container, currently treated specially/hardcoded (use for generic?)
  navigationContainerDef,
] satisfies ComponentDefType[]

export type BaseComponentsType = typeof baseComponents
export type BaseComponentType = BaseComponentsType[number]
