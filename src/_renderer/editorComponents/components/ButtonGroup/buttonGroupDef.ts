import { mdiCheckboxMultipleBlank } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { ButtonGroupPropsSchema } from './buttonGroupPropsRawSchema'
import { ButtonGroup } from '@cmk/fe_utils'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'
import { ComponentDefType } from '../../componentDefType'

export const buttonGroupEditorComponentDef: ComponentDefType = {
  type: 'ButtonGroup' as const,
  props: {
    // children: "test",
    // noWrap: false,
    // align: "inherit",
    items: [{ value: 'test', label: 'test' }],
  },
  state: 'test',
  formGen: (editorController: EditorControllerType) =>
    propertyFormFactory(ButtonGroupPropsSchema, editorController),
  //   formGen: ButtonGroupComponentPropsFormFactory,
  icon: mdiCheckboxMultipleBlank,
  category: 'navigation',
  component: ButtonGroup,
  schema: ButtonGroupPropsSchema,
}

// ButtonPropsSchema
