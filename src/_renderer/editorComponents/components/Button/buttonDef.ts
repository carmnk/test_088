import { mdiButtonCursor } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { ButtonPropsSchema } from './buttonPropsRawSchema'
import { Button } from '@cmk/fe_utils'
import { EditorControllerType } from '../../../editorController/editorControllerTypes'
// import { ApiControllerType } from '../../../apiController/apiController'
import { ComponentDefType } from '../../componentDefType'

export const buttonEditorComponentDef: ComponentDefType = {
  type: 'Button' as const,

  component: Button,
  formGen: (
    editorController: EditorControllerType,
    // apiController: ApiControllerType
  ) => propertyFormFactory(ButtonPropsSchema, editorController),
  props: {
    type: 'primary',
    label: 'test2324____r',
    disabled: false,
    loading: false,
    iconButton: false,
    size: 'medium',
    sx: {},
    slotProps: {
      typography: {},
      startIcon: {},
      endIcon: {},
      tooltip: {},
    },
  },

  icon: mdiButtonCursor,
  category: 'basic',
  schema: ButtonPropsSchema,
}
